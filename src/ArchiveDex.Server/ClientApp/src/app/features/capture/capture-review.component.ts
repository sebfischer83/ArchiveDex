import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Capture, CaptureService } from './capture.service';
import { CaptureReviewFormComponent, CaptureSaved } from './capture-review-form.component';
import { ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';
import { TuiButton, TuiTitle, TuiLoader } from '@taiga-ui/core';

@Component({
  selector: 'app-capture-review',
  standalone: true,
  imports: [ErrorStateComponent, LoadingStateComponent, CaptureReviewFormComponent, TuiButton, TuiTitle, TuiLoader],
  template: `
    <section class="review">
      <header><h2 tuiTitle>Karte prüfen<span tuiSubtitle>Capture</span></h2></header>
      @let c = capture();
      @if (loading()) { <app-loading-state /> }
      @else if (error()) { <app-error-state [message]="error()" (retry)="load()" /> }
      @else if (c?.status === 'uploaded' || c?.status === 'analyzing') {
        <div class="analyzing">
          <tui-loader size="l" />
          <span tuiTitle>Bild wird analysiert…<span tuiSubtitle>Das kann einige Sekunden dauern.</span></span>
        </div>
      }
      @else if (c?.status === 'needsNewImage') {
        <app-error-state [message]="c?.error?.detail || 'Bitte ein neues Bild aufnehmen.'" />
        <button tuiButton type="button" appearance="secondary" (click)="newCapture()">Neues Bild</button>
      }
      @else if (c?.status === 'failed') {
        <app-error-state [message]="c?.error?.detail || 'Analyse fehlgeschlagen.'" />
        @if (c?.error?.retryable) { <button tuiButton type="button" appearance="secondary" (click)="retry()">Analyse wiederholen</button> }
      }
      @else if (c?.status === 'needsReview') {
        <app-capture-review-form [capture]="c!" (saved)="onSaved($event)" />
      }
    </section>
  `,
  styles: [`
    .review{max-width:60rem}
    .analyzing{display:flex;align-items:center;gap:1rem;padding:2rem 0}
  `],
})
export class CaptureReviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CaptureService);
  private readonly destroyRef = inject(DestroyRef);
  readonly capture = signal<Capture | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set('');
    const id = this.route.snapshot.paramMap.get('captureId');
    if (!id) { this.error.set('Capture-ID fehlt.'); this.loading.set(false); return; }
    this.service.rememberActiveCapture(id);
    this.service.poll(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: capture => { this.capture.set(capture); this.loading.set(false); },
      error: error => {
        if (error instanceof HttpErrorResponse && error.status === 404) this.service.clearActiveCapture(id);
        this.error.set('Capture konnte nicht geladen werden.'); this.loading.set(false);
      },
    });
  }

  async onSaved(result: CaptureSaved): Promise<void> {
    await this.router.navigate(['/cards', result.cardRecordId]);
  }

  async retry(): Promise<void> {
    const current = this.capture();
    if (!current) return;
    try { this.capture.set(await this.service.retry(current)); this.load(); }
    catch { this.error.set('Die Analyse konnte nicht neu gestartet werden.'); }
  }

  newCapture(): void {
    const id = this.capture()?.id;
    if (id) this.service.clearActiveCapture(id);
    void this.router.navigate(['/capture']);
  }
}
