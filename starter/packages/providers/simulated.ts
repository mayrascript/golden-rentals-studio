import type { GenerationProvider, Context } from './types.js';
import type { ImageAsset, Review, CalendarEntry } from '../contracts/index.js';
import { checksum, type CampaignStore } from '../storage/index.js';
import { AppError, suggestedCalendar } from '../../apps/server/src/workflow/rules.js';
import { simulatedArt } from './simulated-art.js';

export class SimulatedProvider implements GenerationProvider {
  constructor(private store: CampaignStore, private delay = 250) {}
  private async step(ctx: Context) { ctx.check(); await new Promise(resolve => setTimeout(resolve, this.delay)); ctx.check(); }
  async strategy(ctx: Context) {
    await this.step(ctx);
    return { summary: `Una campaña de ${ctx.campaign.brief.brand.name} para ${ctx.campaign.brief.brand.objective.toLowerCase()}. Tono: ${ctx.campaign.brief.brand.tone}.`, angles: [
      { angleId: 'welcome', title: 'Una primera impresión', purpose: 'Presentar la propuesta y una característica aportada.' },
      { angleId: 'details', title: 'Los pequeños detalles', purpose: 'Dar contexto a una característica confirmada del ejemplo.' },
      { angleId: 'plan', title: 'Imagina tu próxima pausa', purpose: 'Invitar a explorar la propuesta sin prometer disponibilidad.' },
    ] };
  }
  async copies(ctx: Context) {
    await this.step(ctx); const brand = ctx.campaign.brief.brand;
    return { pieces: ctx.campaign.strategy!.angles.map((angle, i) => {
      const fact = brand.facts[i % brand.facts.length];
      return { pieceId: `piece-${i + 1}` as 'piece-1' | 'piece-2' | 'piece-3', angleId: angle.angleId, hook: angle.title,
        body: `${brand.name} · ${fact.statement}. Una idea para explorar tu próxima estancia con calma.`,
        cta: 'Explora la propuesta de tu próxima estancia.', hashtags: ['#InspiraciónDeViaje', '#EstanciasConCalma'], factIds: [fact.factId] };
    }) };
  }
  async designs(ctx: Context) {
    await this.step(ctx);
    return { concepts: ctx.campaign.pieces.map((piece, i) => {
      const art = simulatedArt(ctx.campaign.brief.brand, i);
      return { pieceId: piece.pieceId, prompt: `Ilustración editorial para ${piece.hook}. ${art.description} Paleta ${ctx.campaign.brief.brand.palette.join(', ')}. Sin representar una propiedad real.`, altText: piece.image?.altText ?? art.altText };
    }) };
  }
  async image(ctx: Context, pieceId: string, _prompt: string, version: number): Promise<ImageAsset> {
    await this.step(ctx);
    if (ctx.campaign.usage.images >= 6) throw new AppError('Se alcanzó el límite de imágenes.');
    const { svg, altText } = simulatedArt(ctx.campaign.brief.brand, ctx.campaign.usage.images);
    ctx.campaign.usage.images++;
    const bytes = Buffer.from(svg); const relativePath = `images/${pieceId}-v${version}.svg`;
    await this.store.writeAsset(ctx.campaign.id, relativePath, bytes);
    return { imageId: `${pieceId}-v${version}`, pieceId, version, relativePath, mimeType: 'image/svg+xml', width: 1080, height: 1080, checksum: checksum(bytes), altText, generationMode: 'simulated', promptVersion: '2', disclosure: 'Composición de ejemplo prediseñada con la paleta de tu marca. No es una fotografía ni una imagen generada por IA.' };
  }
  async review(ctx: Context): Promise<{ review: Review; calendar: CalendarEntry[] }> {
    await this.step(ctx);
    return { review: { status: 'APPROVED' as const, findings: [], visualInspection: 'HUMAN_REQUIRED' as const }, calendar: suggestedCalendar(ctx.campaign) };
  }
  async revise(ctx: Context, pieceId: string, instruction: string) {
    await this.step(ctx); const piece = ctx.campaign.pieces.find(p => p.pieceId === pieceId)!;
    const fact = ctx.campaign.brief.brand.facts.find(f => piece.factIds.includes(f.factId))!;
    const shorter = /breve|cort|resum/i.test(instruction);
    return { ...piece, body: shorter ? `${ctx.campaign.brief.brand.name}: ${fact.statement}.` : `${fact.statement}. Descubre la propuesta de ${ctx.campaign.brief.brand.name} a tu ritmo.` };
  }
}
