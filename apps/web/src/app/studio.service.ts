import { Injectable, computed, effect, signal } from '@angular/core';
import type { AppConfig, Brief, Campaign } from '../../../../packages/contracts/index.js';
export const stateLabels: Record<string, string> = { DRAFT: 'Borrador', RUNNING: 'En preparación', NEEDS_INPUT: 'Necesita atención', NEEDS_REVIEW: 'Por revisar', APPROVED: 'Aprobada', FAILED: 'Interrumpida por un error', INTERRUPTED: 'Interrumpida', CANCELLED: 'Cancelada' };
export const localDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
type HistoryItem = { id: string; name: string; state: string; createdAt: string; mode: string };
export async function api<T>(path: string, method = 'GET', body?: unknown, key?: string): Promise<T> {
  const response = await fetch(`/api${path}`, { method, headers: { 'Content-Type': 'application/json', ...(key ? { 'Idempotency-Key': key } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'No se pudo completar la operación.'); return data;
}
@Injectable({ providedIn: 'root' })
export class StudioService {
  readonly config = signal<AppConfig | undefined>(undefined);
  readonly brief = signal<Brief | undefined>(undefined);
  readonly campaign = signal<Campaign | undefined>(undefined);
  readonly history = signal<HistoryItem[]>([]);
  readonly tab = signal<'brief' | 'campaign' | 'calendar'>('brief');
  readonly pending = signal<{ key: string; label: string } | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal(''); readonly notice = signal('');
  readonly busy = computed(() => !!this.pending());
  readonly running = computed(() => this.campaign()?.state === 'RUNNING');
  readonly disabled = computed(() => this.busy() || this.running());
  private createKey = crypto.randomUUID();
  private loadAttempt = 0;
  constructor() {
    effect(onCleanup => {
      const c = this.campaign();
      if (c?.state !== 'RUNNING') return;
      let live = true; let fetching = false;
      const timer = setInterval(async () => {
        if (fetching || this.busy()) return;
        fetching = true;
        try { const next = await api<Campaign>(`/campaigns/${c.id}`); if (live && this.campaign() === c && !this.busy()) this.setCampaign(next); }
        catch (e) { if (live) this.error.set(this.message(e)); }
        finally { fetching = false; }
      }, 700);
      onCleanup(() => { live = false; clearInterval(timer); });
    });
  }
  async load() {
    const attempt = ++this.loadAttempt; this.loading.set(true); this.error.set('');
    try {
      const [config, items] = await Promise.all([api<AppConfig>('/config'), api<HistoryItem[]>('/campaigns')]);
      if (attempt !== this.loadAttempt) return;
      this.config.set(config); this.history.set(items);
      let saved: Brief | undefined;
      try { const raw = localStorage.getItem('golden-brief'); if (raw) saved = JSON.parse(raw); } catch { /* Storage is optional. */ }
      this.brief.set(saved?.brand && saved?.startDate && saved?.timeZone ? saved : { brand: structuredClone(config.demo), startDate: localDate(), timeZone: 'America/Bogota' });
    } catch (e) { if (attempt === this.loadAttempt) this.error.set(this.message(e)); }
    finally { if (attempt === this.loadAttempt) this.loading.set(false); }
  }
  updateBrief(brief: Brief) {
    this.createKey = crypto.randomUUID(); this.brief.set(brief);
    try { localStorage.setItem('golden-brief', JSON.stringify(brief)); } catch { /* Keep the draft in memory. */ }
  }
  resetBrief() { const config = this.config(); if (config) this.updateBrief({ brand: structuredClone(config.demo), startDate: localDate(), timeZone: 'America/Bogota' }); }
  setCampaign(campaign: Campaign) {
    this.campaign.set(campaign);
    this.history.update(items => items.map(item => item.id === campaign.id ? { ...item, state: campaign.state } : item));
  }
  newCampaign() { this.createKey = crypto.randomUUID(); this.campaign.set(undefined); this.tab.set('brief'); }
  private message(e: unknown) { return e instanceof Error ? e.message : 'No se pudo completar la operación.'; }
  private async perform(key: string, label: string, operation: () => Promise<void>, refresh = false) {
    if (this.busy()) return false;
    this.pending.set({ key, label }); this.error.set(''); this.notice.set('');
    try {
      await operation();
      if (refresh) { try { this.history.set(await api('/campaigns')); } catch { this.error.set('El cambio se guardó, pero no pudimos actualizar la lista de campañas.'); } }
      return true;
    } catch (e) { this.error.set(this.message(e)); return false; }
    finally { this.pending.set(undefined); }
  }
  async openCampaign(id: string) { await this.perform(`open-${id}`, 'Cargando campaña…', async () => { this.setCampaign(await api(`/campaigns/${id}`)); this.tab.set('campaign'); }); }
  async generate() {
    const brief = this.brief(); if (!brief) return;
    await this.perform('generate', 'Preparando tu campaña…', async () => {
      const c = await api<Campaign>('/campaigns', 'POST', brief, this.createKey); this.setCampaign(c); this.tab.set('campaign');
      this.setCampaign(await api(`/campaigns/${c.id}/run`, 'POST', {}, `run-${c.id}`));
    }, true);
  }
  async action(path: string, method: string, body: unknown, message = '') {
    const campaign = this.campaign(); if (!campaign) return false;
    const label = path.endsWith('/image') ? 'Generando una nueva imagen…' : path.endsWith('/revise') ? (campaign.mode === 'real' ? 'La IA está ajustando el texto…' : 'Preparando el ajuste de texto…') : path === '/run' ? 'Retomando tu campaña…' : path === '/cancel' ? 'Cancelando la generación…' : path === '/calendar' ? 'Guardando calendario…' : path.endsWith('/approve') ? 'Guardando aprobación…' : 'Guardando cambios…';
    return this.perform(path, label, async () => { this.setCampaign(await api(`/campaigns/${campaign.id}${path}`, method, body, path === '/run' ? crypto.randomUUID() : undefined)); this.notice.set(message); }, true);
  }
  async download(event: Event) {
    event.preventDefault(); const campaign = this.campaign(); if (!campaign || this.disabled()) return;
    await this.perform('/export', 'Preparando descarga…', async () => {
      const response = await fetch(`/api/campaigns/${campaign.id}/export`);
      if (!response.ok) { const data = await response.json(); throw new Error(data.error ?? 'No se pudo preparar la descarga.'); }
      const url = URL.createObjectURL(await response.blob()); const link = document.createElement('a');
      link.href = url; link.download = `campaign-${campaign.id}-${campaign.state === 'APPROVED' ? 'APPROVED' : 'DRAFT'}.zip`;
      document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
      this.notice.set('Archivo preparado. Tu navegador iniciará la descarga.');
    });
  }
}
