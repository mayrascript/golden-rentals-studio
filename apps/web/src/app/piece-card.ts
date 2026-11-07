import { Component, inject, input, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Piece } from '../../../../packages/contracts/index.js';
import { StudioService } from './studio.service.js';
import { BusyLabel, LoadedImage, Spinner, Sun } from './feedback.js';
@Component({ selector: 'studio-piece', imports: [FormsModule, BusyLabel, LoadedImage, Spinner, Sun], templateUrl: './piece-card.html' })
export class PieceCard implements OnInit {
  readonly s = inject(StudioService); readonly piece = input.required<Piece>(); readonly index = input.required<number>();
  editing = false; draft!: Piece; revision = ''; showRevision = false; confirmImage = false; readonly copied = signal(false);
  ngOnInit() { this.draft = structuredClone(this.piece()); }
  get path() { return `/pieces/${this.piece().pieceId}`; }
  get approved() { return this.piece().humanApproval?.version === this.piece().version; }
  get generatingImage() { return this.s.pending()?.key === `${this.path}/image`; }
  get revising() { return this.s.pending()?.key === `${this.path}/revise`; }
  get working() { const key = this.s.pending()?.key; return key === this.path || !!key?.startsWith(`${this.path}/`); }
  fact(id: string) { return this.s.campaign()?.brief.brand.facts.find(f => f.factId === id)?.statement ?? 'Hecho desconocido'; }
  hashtags(value: string) { this.draft.hashtags = value.split(/\s+/).filter(Boolean); }
  edit() { if (!this.editing) this.draft = structuredClone(this.piece()); this.editing = !this.editing; }
  async save() {
    const { hook, body, cta, hashtags, altText } = this.draft;
    if (await this.s.action(this.path, 'PATCH', { hook, body, cta, hashtags, altText, version: this.piece().version }, 'Cambios guardados. Revisa nuevamente esta pieza.')) this.editing = false;
  }
  async revise() { if (await this.s.action(`${this.path}/revise`, 'POST', { instruction: this.revision })) this.showRevision = false; }
  image() { this.confirmImage = false; void this.s.action(`${this.path}/image`, 'POST', {}); }
  async copy() {
    const p = this.piece();
    try { await navigator.clipboard.writeText(`${p.hook}\n\n${p.body}\n\n${p.cta}\n\n${p.hashtags.join(' ')}`); this.copied.set(true); } catch { this.copied.set(false); }
  }
}
