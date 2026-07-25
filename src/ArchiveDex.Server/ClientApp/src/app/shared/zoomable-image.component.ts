import { Component, ElementRef, HostListener, Input, computed, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';

/**
 * Displays an image as a thumbnail button. Clicking opens a fullscreen overlay that
 * supports zooming (mouse wheel / pinch / +/- buttons) and panning (drag). The single-card
 * review, the batch review and the card detail views all reuse this so the zoom behaviour
 * stays consistent. Zoneless-safe: all interactive state lives in signals.
 */
@Component({
  selector: 'app-zoomable-image',
  standalone: true,
  imports: [TuiButton, DecimalPipe],
  template: `
    <button
      class="thumb"
      type="button"
      [attr.aria-label]="alt + ' groß anzeigen und zoomen'"
      (click)="open()"
    >
      <img [src]="thumbnailSrc || src" [alt]="alt" loading="lazy" />
      <span class="zoom-hint" aria-hidden="true">🔍</span>
    </button>

    @if (isOpen()) {
      <div
        class="overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Bild zoomen"
        (pointerdown)="onBackdropPointerDown($event)"
      >
        <div class="toolbar">
          <button tuiButton appearance="secondary" size="s" type="button" (click)="zoomBy(0.8); $event.stopPropagation()" aria-label="Verkleinern">−</button>
          <span class="scale">{{ (scale() * 100) | number:'1.0-0' }}%</span>
          <button tuiButton appearance="secondary" size="s" type="button" (click)="zoomBy(1.25); $event.stopPropagation()" aria-label="Vergrößern">+</button>
          <button tuiButton appearance="secondary" size="s" type="button" (click)="reset(); $event.stopPropagation()">Zurücksetzen</button>
          <button tuiButton appearance="secondary" size="s" type="button" (click)="close()">Schließen</button>
        </div>
        <div
          #stage
          class="stage"
          [class.grabbable]="scale() > 1"
          (wheel)="onWheel($event)"
          (pointerdown)="onPointerDown($event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp($event)"
          (pointercancel)="onPointerUp($event)"
          (dblclick)="onDoubleClick($event)"
        >
          <img class="full" [src]="src" [alt]="alt" [style.transform]="transform()" draggable="false" />
        </div>
      </div>
    }
  `,
  styles: [`
    :host{display:inline-block;line-height:0}
    .thumb{position:relative;padding:0;border:0;border-radius:.4rem;background:var(--tui-background-neutral-1);cursor:zoom-in;line-height:0;display:inline-block}
    .thumb:focus-visible{outline:3px solid var(--tui-border-focus);outline-offset:3px}
    .thumb img{display:block;width:100%;height:100%;object-fit:contain;border-radius:.4rem}
    .zoom-hint{position:absolute;right:.35rem;bottom:.35rem;font-size:.85rem;background:rgba(0,0,0,.55);color:#fff;border-radius:.3rem;padding:.05rem .3rem;line-height:1.2}
    .overlay{position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;background:rgba(0,0,0,.86);touch-action:none;user-select:none}
    .toolbar{display:flex;align-items:center;gap:.5rem;padding:.75rem;justify-content:center;flex-wrap:wrap}
    .toolbar .scale{color:#fff;min-width:3.5rem;text-align:center;font-variant-numeric:tabular-nums}
    .stage{flex:1;overflow:hidden;display:grid;place-items:center;cursor:zoom-in}
    .stage.grabbable{cursor:grab}
    .stage.grabbable:active{cursor:grabbing}
    .full{max-width:92vw;max-height:82vh;width:auto;height:auto;object-fit:contain;transform-origin:center center;will-change:transform;border-radius:.4rem}
  `],
})
export class ZoomableImageComponent {
  @Input({ required: true }) src = '';
  @Input() thumbnailSrc = '';
  @Input() alt = '';

  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  readonly isOpen = signal(false);
  readonly scale = signal(1);
  private readonly tx = signal(0);
  private readonly ty = signal(0);
  readonly transform = computed(() => `translate(${this.tx()}px, ${this.ty()}px) scale(${this.scale()})`);

  private readonly minScale = 1;
  private readonly maxScale = 8;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private pinchStartDistance = 0;
  private pinchStartScale = 1;
  private panStart: { x: number; y: number; tx: number; ty: number } | null = null;

  open(): void {
    this.reset();
    this.isOpen.set(true);
  }

  @HostListener('document:keydown.escape')
  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.pointers.clear();
    this.panStart = null;
  }

  reset(): void {
    this.scale.set(1);
    this.tx.set(0);
    this.ty.set(0);
  }

  zoomBy(factor: number): void {
    this.applyZoom(this.scale() * factor, 0, 0);
  }

  onDoubleClick(event: MouseEvent): void {
    const rect = this.stage()?.nativeElement.getBoundingClientRect();
    const cx = rect ? event.clientX - (rect.left + rect.width / 2) : 0;
    const cy = rect ? event.clientY - (rect.top + rect.height / 2) : 0;
    this.applyZoom(this.scale() > 1 ? this.minScale : 2.5, cx, cy);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const rect = this.stage()?.nativeElement.getBoundingClientRect();
    const cx = rect ? event.clientX - (rect.left + rect.width / 2) : 0;
    const cy = rect ? event.clientY - (rect.top + rect.height / 2) : 0;
    const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
    this.applyZoom(this.scale() * factor, cx, cy);
  }

  onBackdropPointerDown(event: PointerEvent): void {
    // Only close when the click is on the dim backdrop itself, not the image/toolbar.
    if (event.target === event.currentTarget) this.close();
  }

  onPointerDown(event: PointerEvent): void {
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinchStartDistance = Math.hypot(a.x - b.x, a.y - b.y);
      this.pinchStartScale = this.scale();
      this.panStart = null;
    } else if (this.scale() > 1) {
      this.panStart = { x: event.clientX, y: event.clientY, tx: this.tx(), ty: this.ty() };
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.pointers.size === 2 && this.pinchStartDistance > 0) {
      const [a, b] = [...this.pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      this.applyZoom(this.pinchStartScale * (distance / this.pinchStartDistance), 0, 0);
      return;
    }

    if (this.panStart) {
      this.tx.set(this.panStart.tx + (event.clientX - this.panStart.x));
      this.ty.set(this.panStart.ty + (event.clientY - this.panStart.y));
    }
  }

  onPointerUp(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    if (this.pointers.size < 2) this.pinchStartDistance = 0;
    if (this.pointers.size === 0) this.panStart = null;
  }

  /** Zooms toward the point (cx, cy) given relative to the stage centre so it stays put. */
  private applyZoom(next: number, cx: number, cy: number): void {
    const clamped = Math.min(this.maxScale, Math.max(this.minScale, next));
    const ratio = clamped / this.scale();
    if (clamped <= this.minScale) {
      this.reset();
      return;
    }
    this.tx.set(cx - (cx - this.tx()) * ratio);
    this.ty.set(cy - (cy - this.ty()) * ratio);
    this.scale.set(clamped);
  }
}
