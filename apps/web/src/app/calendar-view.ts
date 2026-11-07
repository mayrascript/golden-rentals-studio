import { Component, inject, input, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Campaign, CalendarEntry } from '../../../../packages/contracts/index.js';
import { StudioService, stateLabels } from './studio.service.js';
import { BusyLabel, LoadedImage, Sun } from './feedback.js';
@Component({ selector: 'studio-calendar', imports: [FormsModule, BusyLabel, LoadedImage, Sun], templateUrl: './calendar-view.html' })
export class CalendarView implements OnInit {
  readonly s = inject(StudioService); readonly campaign = input.required<Campaign>(); readonly labels = stateLabels;
  entries: CalendarEntry[] = []; reviewer = 'Participante local';
  ngOnInit() { this.entries = structuredClone(this.campaign().calendar); }
  get dirty() { return JSON.stringify(this.entries) !== JSON.stringify(this.campaign().calendar); }
  get allApproved() { const pieces = this.campaign().pieces; return pieces.length === 3 && pieces.every(p => p.humanApproval?.version === p.version); }
  piece(id: string) { return this.campaign().pieces.find(p => p.pieceId === id); }
}
