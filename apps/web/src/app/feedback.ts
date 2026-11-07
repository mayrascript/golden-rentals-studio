import { Component, effect, input, signal } from '@angular/core';
@Component({ selector: 'studio-sun', template: `<svg [attr.width]="small() ? 24 : 38" [attr.height]="small() ? 24 : 38" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 28a12 12 0 0 1 24 0M4 31h32M20 3v7M5 12l5 5M35 12l-5 5" stroke="currentColor" stroke-width="2"/></svg>` })
export class Sun { readonly small = input(false); }
@Component({ selector: 'studio-spinner', template: `<span class="spinner" aria-hidden="true"></span>` })
export class Spinner {}
@Component({ selector: 'studio-busy', imports: [Spinner], template: `@if (active()) { <studio-spinner/>{{ pending() }} } @else { <ng-content/> }` })
export class BusyLabel { readonly active = input(false); readonly pending = input('Guardando…'); }
@Component({ selector: 'studio-loading', imports: [Spinner], template: `<section class="studio-loading" aria-busy="true"><p class="loading-message" role="status"><studio-spinner/>Preparando el estudio…</p><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-line"></div><div class="skeleton-fields" aria-hidden="true">@for (n of [0,1,2,3]; track n) { <div class="skeleton"></div> }</div></section>` })
export class StudioLoading {}
@Component({ selector: 'studio-image', imports: [Spinner], template: `<div class="loaded-image" [class.loading]="state() === 'loading'" [class.error]="state() === 'error'" [attr.aria-busy]="state() === 'loading'">
<img [src]="attempt() ? src() + '?retry=' + attempt() : src()" [alt]="alt()" (load)="state.set('ready')" (error)="state.set('error')"/>
@if (state() === 'loading') { <span class="image-loading" role="status"><studio-spinner/><span>Cargando imagen…</span></span> }
@if (state() === 'error') { <div class="image-loading" role="alert"><span>No se pudo cargar la imagen.</span><button type="button" class="text-button" (click)="retry()">Reintentar carga</button></div> }
</div>` })
export class LoadedImage {
  readonly src = input.required<string>(); readonly alt = input(''); readonly state = signal<'loading' | 'ready' | 'error'>('loading'); readonly attempt = signal(0);
  constructor() { effect(() => { this.src(); this.state.set('loading'); this.attempt.set(0); }); }
  retry() { this.state.set('loading'); this.attempt.update(n => n + 1); }
}
