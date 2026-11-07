import { Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Brand, Brief } from '../../../../packages/contracts/index.js';
import { StudioService, stateLabels } from './studio.service.js';
import { BusyLabel, Spinner, StudioLoading, Sun } from './feedback.js';
import { PieceCard } from './piece-card.js';
import { CalendarView } from './calendar-view.js';
@Component({ selector: 'studio-app', imports: [FormsModule, BusyLabel, Spinner, StudioLoading, Sun, PieceCard, CalendarView], templateUrl: './app.html' })
export class App implements OnInit {
  readonly s = inject(StudioService); readonly labels = stateLabels;
  ngOnInit() { void this.s.load(); }
  brand(field: keyof Brand, value: unknown) { const b = this.s.brief(); if (b) this.s.updateBrief({ ...b, brand: { ...b.brand, [field]: value } }); }
  brief(field: keyof Brief, value: string) { const b = this.s.brief(); if (b) this.s.updateBrief({ ...b, [field]: value }); }
  facts(value: string) { this.brand('facts', value.split('\n').map((statement, i) => ({ factId: `fact-${i + 1}`, key: `fact-${i + 1}`, statement, status: 'USER_PROVIDED', sourceId: 'brief', locator: `facts[${i}]` }))); }
  factsText() { return this.s.brief()?.brand.facts.map(f => f.statement).join('\n') ?? ''; }
  color(index: number, value: string) { this.brand('palette', this.s.brief()!.brand.palette.map((c, i) => i === index ? value : c)); }
  date(value: string) { return new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short' }).format(new Date(value)); }
  get activityLabel() { return this.s.pending()?.label ?? `Preparando campaña · ${this.s.config()?.agents.find(a => a.id === this.s.campaign()?.activeAgent)?.label ?? 'equipo creativo'}`; }
  get activityDetail() { const key = this.s.pending()?.key; return key === '/export' ? 'Reuniendo textos, imágenes y calendario.' : this.s.running() || key?.endsWith('/image') || key?.endsWith('/revise') ? (this.s.campaign()?.mode === 'real' ? 'La IA puede tardar un momento. Tus resultados aparecerán aquí.' : 'Estamos preparando tu contenido de prueba…') : 'Un momento, estamos procesando tu solicitud.'; }
  get runStatus() { const c = this.s.campaign(); return c?.activeAgent ? `Trabajando: ${this.s.config()?.agents.find(a => a.id === c.activeAgent)?.label}${c.activeAgent === 'designer' ? ` · ${c.pieces.filter(p => p.image).length} de 3 imágenes listas` : ''}` : c?.events.at(-1)?.message ?? 'Todo listo para empezar.'; }
}
