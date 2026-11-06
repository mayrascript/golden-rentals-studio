import { randomUUID } from 'node:crypto';
import { briefSchema, strategySchema, copiesSchema, designsSchema, editorSchema, copySchema, calendarSchema, editSchema,
  type Campaign, type Mode, type Piece, type AgentId } from '../../../../packages/contracts/index.js';
import { CampaignStore, checksum } from '../../../../packages/storage/index.js';
import type { GenerationProvider, Context } from '../../../../packages/providers/types.js';
import { AppError, audit, packageHash, validateFacts, validateCalendar } from './rules.js';

export const LIMITS = { images: 3, regenerations: 3, revisions: 1, modelCalls: 12 };
type ProviderFactory = () => Promise<GenerationProvider>;
export class CampaignService {
  private campaigns = new Map<string, Campaign>();
  private active?: string;
  private jobs = new Map<string, Promise<void>>();
  constructor(readonly store: CampaignStore, readonly mode: Mode, private providerFactory: ProviderFactory) {}
  async init() {
    for (const c of await this.store.list()) {
      if (c.state === 'RUNNING') { c.state = 'INTERRUPTED'; c.activeAgent = undefined; c.error = 'La ejecución se interrumpió. Puedes continuar desde los resultados guardados.'; await this.store.save(c); }
      this.campaigns.set(c.id, c);
    }
  }
  list() { return [...this.campaigns.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
  get(id: string) { const c = this.campaigns.get(id); if (!c) throw new AppError('No se encontró esta campaña.', 404); return c; }
  private async save(c: Campaign) { c.updatedAt = new Date().toISOString(); c.packageHash = packageHash(c); await this.store.save(c); }
  private event(c: Campaign, message: string) { c.events.push({ at: new Date().toISOString(), message }); c.events = c.events.slice(-50); }
  async create(input: unknown, key: string) {
    if (!/^[a-zA-Z0-9_-]{8,100}$/.test(key)) throw new AppError('La solicitud necesita una clave de idempotencia válida.');
    const brief = briefSchema.parse(input); validateFacts(brief); const requestHash = checksum(JSON.stringify(brief));
    const existing = this.list().find(c => c.createKey === key);
    if (existing) { if (existing.requestHash !== requestHash) throw new AppError('Esta clave corresponde a otro brief.', 409); return existing; }
    const now = new Date().toISOString();
    const c: Campaign = { id: randomUUID(), brief, mode: this.mode, state: 'DRAFT', createdAt: now, updatedAt: now, completedSteps: [], pieces: [], calendar: [], packageHash: '', usage: { modelCalls: 0, images: 0, regenerations: 0, revisions: 0, tokens: 0 }, events: [], createKey: key, requestHash };
    this.campaigns.set(c.id, c); await this.save(c); return c;
  }
  private context(c: Campaign): Context {
    return { campaign: c, check: () => { if (c.state === 'CANCELLED') throw new AppError('Ejecución cancelada.'); },
      countCall: () => { if (c.state === 'CANCELLED') throw new AppError('Ejecución cancelada.'); if (c.usage.modelCalls >= LIMITS.modelCalls) throw new AppError('Se alcanzó el límite de llamadas. Conservamos los resultados.'); c.usage.modelCalls++; },
      addTokens: count => { c.usage.tokens += count; } };
  }
  async start(id: string, key = 'first-run') {
    const c = this.get(id);
    if (!/^[a-zA-Z0-9_-]{8,100}$/.test(key)) throw new AppError('Se necesita una clave válida para iniciar.');
    if (c.runKeys?.includes(key)) return c;
    if (c.state === 'RUNNING' || c.state === 'NEEDS_REVIEW' || c.state === 'APPROVED') return c;
    if (this.active) throw new AppError('Hay otra operación en curso. Espera a que termine.', 409);
    if (c.mode !== this.mode) throw new AppError('El modo de la campaña no coincide con el servidor. Cambia de modo o crea una campaña nueva.');
    this.active = id; c.runKeys = [...(c.runKeys ?? []), key]; c.state = 'RUNNING'; c.startedAt = new Date().toISOString(); c.error = undefined;
    await this.save(c);
    const job = this.execute(c).finally(() => { this.active = undefined; this.jobs.delete(id); });
    this.jobs.set(id, job); return c;
  }
  async wait(id: string) { await this.jobs.get(id); }
  private async execute(c: Campaign) {
    const ctx = this.context(c);
    try {
      const provider = await this.providerFactory();
      const phase = async (agent: AgentId, action: () => Promise<void>) => {
        ctx.check(); if (c.completedSteps.includes(agent)) return;
        c.activeAgent = agent; this.event(c, `Iniciando ${agent}.`); await this.save(c);
        await action(); ctx.check(); c.completedSteps.push(agent); await this.save(c);
      };
      await phase('strategist', async () => { c.strategy = strategySchema.parse(await provider.strategy(ctx)); });
      await phase('copywriter', async () => {
        const result = copiesSchema.parse(await provider.copies(ctx)); this.validateCopies(c, result.pieces);
        c.pieces = result.pieces.map(piece => ({ ...piece, version: 1, altText: 'Imagen pendiente de generación.', visualBrief: '', history: [] }));
      });
      await phase('designer', async () => {
        const result = designsSchema.parse(await provider.designs(ctx));
        if (new Set(result.concepts.map(x => x.pieceId)).size !== 3) throw new AppError('El diseñador debe entregar tres conceptos distintos.');
        for (const piece of c.pieces) {
          ctx.check(); const concept = result.concepts.find(x => x.pieceId === piece.pieceId)!;
          piece.visualBrief = concept.prompt; piece.altText = concept.altText;
          if (!piece.image) {
            if (c.usage.images >= LIMITS.images + LIMITS.regenerations) throw new AppError('Se alcanzó el límite de imágenes.');
            piece.image = await provider.image(ctx, piece.pieceId, piece.visualBrief, piece.version);
            if (piece.image.altText) piece.altText = piece.image.altText;
            ctx.check(); await this.save(c);
          }
        }
      });
      await phase('editor', async () => {
        let result = editorSchema.parse(await provider.review(ctx)); validateCalendar(c, result.calendar);
        c.calendar = result.calendar; c.review = audit(c, result.review);
        if (c.review.status === 'NEEDS_REVISION' && c.usage.revisions < LIMITS.revisions) {
          ctx.check(); c.usage.revisions++; await this.save(c);
          const revised = copiesSchema.parse(await provider.copies(ctx, JSON.stringify(c.review.findings))); this.validateCopies(c, revised.pieces);
          for (const piece of c.pieces) { this.snapshot(piece); Object.assign(piece, revised.pieces.find(p => p.pieceId === piece.pieceId)); }
          result = editorSchema.parse(await provider.review(ctx)); validateCalendar(c, result.calendar);
          c.calendar = result.calendar; c.review = audit(c, result.review);
        }
      });
      ctx.check(); c.state = 'NEEDS_REVIEW'; this.event(c, 'Campaña preparada. Revisa el texto y las imágenes antes de aprobar.');
    } catch (error) {
      if (c.state !== 'CANCELLED') { c.state = error instanceof AppError ? 'NEEDS_INPUT' : 'FAILED'; c.error = error instanceof AppError ? error.message : 'La generación no pudo completarse. Revisa la configuración del proveedor o vuelve a intentarlo; los resultados completos se conservaron.'; }
    } finally { c.activeAgent = undefined; await this.save(c); }
  }
  private validateCopies(c: Campaign, copies: { pieceId: string; angleId: string; factIds: string[] }[]) {
    if (new Set(copies.map(p => p.pieceId)).size !== 3) throw new AppError('El redactor debe devolver tres piezas distintas.');
    for (const piece of copies) {
      if (!c.strategy?.angles.some(a => a.angleId === piece.angleId)) throw new AppError('El copy referencia un ángulo desconocido.');
      if (piece.factIds.some(id => !c.brief.brand.facts.some(f => f.factId === id))) throw new AppError('El copy referencia hechos desconocidos.');
    }
  }
  private editable(c: Campaign) { if (this.active === c.id || c.state === 'RUNNING') throw new AppError('Espera a que termine la operación de esta campaña.', 409); }
  private piece(c: Campaign, id: string) { const piece = c.pieces.find(p => p.pieceId === id); if (!piece) throw new AppError('Pieza no encontrada.', 404); return piece; }
  private snapshot(piece: Piece) {
    piece.history.push({ version: piece.version, hook: piece.hook, body: piece.body, cta: piece.cta, hashtags: [...piece.hashtags], altText: piece.altText, image: piece.image });
    piece.version++; piece.humanApproval = undefined;
  }
  private invalidate(c: Campaign) {
    c.approval = undefined; c.state = 'NEEDS_REVIEW';
    c.review = audit(c); this.event(c, 'Versión actualizada. Se requiere una nueva revisión humana.');
  }
  async edit(id: string, pieceId: string, input: unknown) {
    const c = this.get(id); this.editable(c); const piece = this.piece(c, pieceId); const edit = editSchema.parse(input);
    if (piece.version !== edit.version) throw new AppError('Esta pieza cambió. Recarga antes de guardar.', 409);
    this.snapshot(piece); const { version: _version, ...changes } = edit; Object.assign(piece, changes);
    c.calendar = c.calendar.map(entry => entry.pieceId === pieceId ? { ...entry, topic: piece.hook } : entry);
    this.invalidate(c); await this.save(c); return c;
  }
  async calendar(id: string, input: unknown, expectedHash: string) {
    const c = this.get(id); this.editable(c); if (c.packageHash !== expectedHash) throw new AppError('La campaña cambió. Recarga el calendario.', 409);
    const calendar = calendarSchema.parse(input); validateCalendar(c, calendar); c.calendar = calendar; this.invalidate(c); await this.save(c); return c;
  }
  async approvePiece(id: string, pieceId: string, version: number) {
    const c = this.get(id); this.editable(c); const piece = this.piece(c, pieceId);
    if (piece.version !== version) throw new AppError('Esta aprobación corresponde a una versión anterior.', 409);
    if (!piece.image || audit(c, c.review).findings.some(f => f.severity === 'blocking' && (!f.pieceId || f.pieceId === pieceId))) throw new AppError('Resuelve los bloqueos de esta pieza antes de aprobar.');
    piece.humanApproval = { version, approvedAt: new Date().toISOString() }; await this.save(c); return c;
  }
  async approve(id: string, expectedHash: string, reviewerLabel: string) {
    const c = this.get(id); this.editable(c);
    if (expectedHash !== c.packageHash) throw new AppError('La campaña cambió. Revisa la versión actual antes de aprobar.', 409);
    validateCalendar(c, c.calendar);
    if (audit(c, c.review).status !== 'APPROVED' || c.pieces.some(p => !p.image || p.humanApproval?.version !== p.version)) throw new AppError('Revisa y aprueba las tres piezas, y resuelve los bloqueos.');
    c.approval = { packageHash: c.packageHash, approvedAt: new Date().toISOString(), reviewerLabel }; c.state = 'APPROVED'; await this.save(c); return c;
  }
  async cancel(id: string) {
    const c = this.get(id); if (c.state !== 'RUNNING') return c;
    c.state = 'CANCELLED'; c.approval = undefined;
    this.event(c, `Cancelada. No se iniciarán nuevos pasos. Imágenes solicitadas: ${c.usage.images}; una llamada en curso puede finalizar y tener costo.`);
    await this.save(c); return c;
  }
  async regenerate(id: string, pieceId: string, instruction?: string) {
    const c = this.get(id); this.editable(c); const piece = this.piece(c, pieceId);
    if (this.active) throw new AppError('Hay otra operación en curso.', 409);
    if (c.mode !== this.mode) throw new AppError('El modo de la campaña no coincide con el servidor.');
    if (instruction ? c.usage.revisions >= LIMITS.revisions : c.usage.regenerations >= LIMITS.regenerations) throw new AppError('Se alcanzó el límite de revisiones o regeneraciones. Puedes editar el texto manualmente.');
    this.active = id; c.state = 'RUNNING'; c.activeAgent = instruction ? 'copywriter' : 'designer';
    c.approval = undefined; piece.humanApproval = undefined;
    try {
      if (instruction) c.usage.revisions++; else c.usage.regenerations++;
      await this.save(c); const provider = await this.providerFactory(); const ctx = this.context(c);
      if (instruction) {
        const result = copySchema.parse(await provider.revise(ctx, pieceId, instruction)); ctx.check();
        if (result.pieceId !== pieceId || result.factIds.some(f => !c.brief.brand.facts.some(x => x.factId === f))) throw new AppError('La revisión devolvió una pieza o hechos inválidos.');
        this.snapshot(piece); Object.assign(piece, result);
        c.calendar = c.calendar.map(entry => entry.pieceId === pieceId ? { ...entry, topic: piece.hook } : entry);
      } else {
        const image = await provider.image(ctx, pieceId, piece.visualBrief, piece.version + 1); ctx.check();
        this.snapshot(piece); piece.image = image;
        if (image.altText) piece.altText = image.altText;
      }
      this.invalidate(c); c.error = undefined;
    } catch (error) {
      if ((c.state as string) !== 'CANCELLED') { c.state = 'NEEDS_REVIEW'; c.error = error instanceof AppError ? error.message : 'No se pudo actualizar la pieza. Se conservó la versión anterior.'; }
    } finally { this.active = undefined; c.activeAgent = undefined; await this.save(c); }
    return c;
  }
}
