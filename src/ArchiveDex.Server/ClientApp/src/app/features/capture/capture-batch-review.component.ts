import { Component, DestroyRef, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { from, mergeMap } from 'rxjs';
import { BatchItem, BatchSummary, Capture, CaptureService } from './capture.service';
import { CaptureReviewFormComponent } from './capture-review-form.component';
import { ZoomableImageComponent } from '../../shared/zoomable-image.component';
import { ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';
import { TuiButton, TuiTitle, TuiLoader } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';

const ACCEPT_ALL_CONCURRENCY = 3;

@Component({
  selector: 'app-capture-batch-review',
  standalone: true,
  imports: [
    CaptureReviewFormComponent, ZoomableImageComponent, ErrorStateComponent, LoadingStateComponent,
    TuiButton, TuiTitle, TuiLoader, TuiBadge,
  ],
  template: `
    <section class="batch">
      <header>
        <h2 tuiTitle>Batch-Ergebnisse<span tuiSubtitle>Prüfe die Karten und übernimm sie in deine Sammlung.</span></h2>
      </header>

      @if (loading()) { <app-loading-state /> }
      @else if (error()) { <app-error-state [message]="error()" (retry)="reload()" /> }
      @else if (summary(); as s) {
        <div class="progress-panel">
          <div class="bar" role="progressbar" [attr.aria-valuenow]="s.finalized" aria-valuemin="0" [attr.aria-valuemax]="s.total">
            <div class="bar-fill" [style.width.%]="s.total ? (s.finalized / s.total) * 100 : 0"></div>
          </div>
          <div class="counts">
            <span tuiBadge appearance="positive">{{ s.finalized }} gespeichert</span>
            <span tuiBadge appearance="warning">{{ s.counts.needsReview }} zu prüfen</span>
            @if (processing() > 0) { <span tuiBadge appearance="info">{{ processing() }} in Analyse</span> }
            @if (s.counts.failed > 0) { <span tuiBadge appearance="negative">{{ s.counts.failed }} fehlgeschlagen</span> }
            @if (s.counts.needsNewImage > 0) { <span tuiBadge appearance="neutral">{{ s.counts.needsNewImage }} kein Kartenbild</span> }
            <span class="total">{{ s.total }} gesamt</span>
          </div>
          <div class="actions">
            <button tuiButton size="s" appearance="primary" type="button"
              [disabled]="bulkRunning() || s.counts.needsReview === 0"
              (click)="acceptAll()">
              {{ bulkRunning() ? 'Übernehme…' : 'Alle Vorschläge übernehmen' }}
            </button>
            <button tuiButton size="s" appearance="flat" type="button" (click)="finish()">Fertig</button>
            <button tuiButton size="s" appearance="flat" type="button" (click)="discard()">Batch verwerfen</button>
          </div>
        </div>

        @if (s.items.length === 0) {
          @if (s.finalized > 0) {
            <p class="done-note">Alle {{ s.finalized }} Karten sind gespeichert. 🎉</p>
          } @else {
            <p class="done-note">Noch keine Ergebnisse – die Analyse läuft.</p>
          }
        }

        <ul class="items">
          @for (item of s.items; track item.captureId) {
            <li class="item" [class.expanded]="isExpanded(item.captureId)">
              <div class="row">
                <app-zoomable-image class="thumb" [src]="fullUrl(item.captureId)" [thumbnailSrc]="item.thumbnailUrl" [alt]="item.name || 'Karte'" />
                <div class="info">
                  @switch (item.status) {
                    @case ('needsReview') {
                      <strong>{{ item.name || 'Unbekannte Karte' }}</strong>
                      <span class="meta">
                        {{ item.setName || '—' }} · #{{ item.printedNumber || '—' }} · {{ item.condition || 'NM' }}
                        @if (item.valuationAmountMinor != null) { · {{ (item.valuationAmountMinor / 100).toFixed(2) }} EUR }
                      </span>
                      @if (itemError(item.captureId); as msg) { <span class="item-error">{{ msg }}</span> }
                    }
                    @case ('failed') {
                      <strong>Analyse fehlgeschlagen</strong>
                      <span class="meta">{{ item.error?.detail || 'Bitte erneut versuchen.' }}</span>
                    }
                    @case ('needsNewImage') {
                      <strong>Keine erkennbare Karte</strong>
                      <span class="meta">{{ item.error?.detail || 'Das Bild zeigt keine eindeutige Karte.' }}</span>
                    }
                    @default {
                      <span class="analyzing"><tui-loader size="s" /> Wird analysiert…</span>
                    }
                  }
                </div>
                <div class="row-actions">
                  @switch (item.status) {
                    @case ('needsReview') {
                      <button tuiButton size="s" appearance="primary" type="button" [disabled]="isBusy(item.captureId)" (click)="accept(item)">
                        {{ isBusy(item.captureId) ? '…' : 'Übernehmen' }}
                      </button>
                      <button tuiButton size="s" appearance="flat" type="button" [disabled]="isBusy(item.captureId)" (click)="toggle(item)">
                        {{ isExpanded(item.captureId) ? 'Schließen' : 'Bearbeiten' }}
                      </button>
                    }
                    @case ('failed') {
                      @if (item.error?.retryable) {
                        <button tuiButton size="s" appearance="secondary" type="button" [disabled]="isBusy(item.captureId)" (click)="retry(item)">Wiederholen</button>
                      }
                      <button tuiButton size="s" appearance="flat" type="button" [disabled]="isBusy(item.captureId)" (click)="skip(item)">Entfernen</button>
                    }
                    @case ('needsNewImage') {
                      <button tuiButton size="s" appearance="flat" type="button" [disabled]="isBusy(item.captureId)" (click)="skip(item)">Überspringen</button>
                    }
                  }
                </div>
              </div>

              @if (isExpanded(item.captureId)) {
                @if (fullCapture(item.captureId); as capture) {
                  <app-capture-review-form [capture]="capture" submitLabel="Speichern" (saved)="onSaved(item)" />
                } @else {
                  <app-loading-state />
                }
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: [`
    .batch{max-width:60rem;display:flex;flex-direction:column;gap:1.5rem}
    .progress-panel{display:flex;flex-direction:column;gap:.75rem;padding:1rem;border-radius:var(--tui-radius-l);background:var(--tui-background-neutral-1);position:sticky;top:0;z-index:2}
    .bar{height:.75rem;border-radius:.75rem;background:var(--tui-background-base);overflow:hidden}
    .bar-fill{height:100%;background:var(--tui-background-accent-1);transition:width .3s ease}
    .counts{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
    .counts .total{margin-inline-start:auto;color:var(--tui-text-tertiary)}
    .actions{display:flex;flex-wrap:wrap;gap:.5rem}
    .done-note{color:var(--tui-text-secondary)}
    .items{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.75rem}
    .item{border:1px solid var(--tui-border-normal);border-radius:var(--tui-radius-l);padding:.75rem}
    .item.expanded{border-color:var(--tui-border-focus)}
    .row{display:grid;grid-template-columns:5rem 1fr auto;gap:1rem;align-items:center}
    .thumb{width:5rem;height:6.9rem}
    .info{display:flex;flex-direction:column;gap:.25rem;min-width:0}
    .info .meta{color:var(--tui-text-secondary);font-size:.9rem}
    .item-error{color:var(--tui-text-negative);font-size:.85rem}
    .analyzing{display:flex;align-items:center;gap:.5rem;color:var(--tui-text-secondary)}
    .row-actions{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:flex-end}
    @media(max-width:640px){.row{grid-template-columns:4rem 1fr}.row-actions{grid-column:1/-1;justify-content:flex-start}.thumb{width:4rem;height:5.5rem}}
  `],
})
export class CaptureBatchReviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CaptureService);
  private readonly destroyRef = inject(DestroyRef);

  readonly summary = signal<BatchSummary | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly bulkRunning = signal(false);
  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());
  private readonly busyIds = signal<ReadonlySet<string>>(new Set());
  private readonly fullCaptures = signal<ReadonlyMap<string, Capture>>(new Map());
  private readonly itemErrors = signal<ReadonlyMap<string, string>>(new Map());

  readonly processing = computed(() => {
    const c = this.summary()?.counts;
    return c ? c.uploaded + c.analyzing : 0;
  });

  private batchId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('batchId');
    if (!id) { this.error.set('Batch-ID fehlt.'); this.loading.set(false); return; }
    this.batchId = id;
    this.service.rememberActiveBatch(id);
    this.service.pollBatch(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: summary => { this.summary.set(summary); this.loading.set(false); },
      error: err => {
        if (err instanceof HttpErrorResponse && err.status === 404) this.service.clearActiveBatch(id);
        this.error.set('Der Batch konnte nicht geladen werden.'); this.loading.set(false);
      },
    });
  }

  reload(): void { this.loading.set(true); this.error.set(''); this.ngOnInit(); }

  fullUrl(id: string): string { return `/api/v1/captures/${id}/image?size=full`; }
  isExpanded(id: string): boolean { return this.expandedIds().has(id); }
  isBusy(id: string): boolean { return this.busyIds().has(id); }
  fullCapture(id: string): Capture | undefined { return this.fullCaptures().get(id); }
  itemError(id: string): string | undefined { return this.itemErrors().get(id); }

  async toggle(item: BatchItem): Promise<void> {
    if (this.isExpanded(item.captureId)) {
      this.mutateSet(this.expandedIds, s => s.delete(item.captureId));
      return;
    }
    this.mutateSet(this.expandedIds, s => s.add(item.captureId));
    if (!this.fullCaptures().has(item.captureId)) {
      try {
        const capture = await this.service.getCapture(item.captureId);
        this.mutateMap(this.fullCaptures, m => m.set(item.captureId, capture));
      } catch {
        this.setItemError(item.captureId, 'Karte konnte nicht geladen werden.');
        this.mutateSet(this.expandedIds, s => s.delete(item.captureId));
      }
    }
  }

  async accept(item: BatchItem): Promise<void> {
    this.setBusy(item.captureId, true);
    this.setItemError(item.captureId, '');
    try {
      await this.service.acceptProposed(item.captureId);
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 409 && err.error?.code === 'DUPLICATE_IMAGE') {
        if (confirm(`„${item.name || 'Diese Karte'}" ist bereits gespeichert. Trotzdem als weiteres Exemplar anlegen?`)) {
          try { await this.service.acceptProposed(item.captureId, true); }
          catch { this.setItemError(item.captureId, 'Konnte nicht gespeichert werden.'); }
        }
      } else {
        this.setItemError(item.captureId, 'Konnte nicht gespeichert werden.');
      }
    } finally {
      this.setBusy(item.captureId, false);
    }
  }

  async retry(item: BatchItem): Promise<void> {
    this.setBusy(item.captureId, true);
    try {
      const capture = await this.service.getCapture(item.captureId);
      await this.service.retry(capture);
    } catch {
      this.setItemError(item.captureId, 'Neustart der Analyse fehlgeschlagen.');
    } finally {
      this.setBusy(item.captureId, false);
    }
  }

  async skip(item: BatchItem): Promise<void> {
    this.setBusy(item.captureId, true);
    try { await this.service.deleteCapture(item.captureId, item.etag); }
    catch { this.setItemError(item.captureId, 'Konnte nicht entfernt werden.'); }
    finally { this.setBusy(item.captureId, false); }
  }

  onSaved(item: BatchItem): void {
    this.mutateSet(this.expandedIds, s => s.delete(item.captureId));
    this.mutateMap(this.fullCaptures, m => m.delete(item.captureId));
  }

  acceptAll(): void {
    const items = (this.summary()?.items ?? []).filter(i => i.status === 'needsReview' && !this.isBusy(i.captureId));
    if (items.length === 0) return;
    this.bulkRunning.set(true);
    from(items).pipe(
      mergeMap(item => {
        this.setBusy(item.captureId, true);
        return from(this.acceptQuiet(item));
      }, ACCEPT_ALL_CONCURRENCY),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      complete: () => this.bulkRunning.set(false),
      error: () => this.bulkRunning.set(false),
    });
  }

  /** Accept without prompting; duplicates/failures are flagged inline for manual handling. */
  private async acceptQuiet(item: BatchItem): Promise<void> {
    try {
      await this.service.acceptProposed(item.captureId);
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 409 && err.error?.code === 'DUPLICATE_IMAGE') {
        this.setItemError(item.captureId, 'Bereits vorhanden – bitte manuell entscheiden.');
      } else {
        this.setItemError(item.captureId, 'Konnte nicht gespeichert werden.');
      }
    } finally {
      this.setBusy(item.captureId, false);
    }
  }

  async discard(): Promise<void> {
    if (!confirm('Den gesamten Batch verwerfen? Noch nicht gespeicherte Karten gehen verloren.')) return;
    try { await this.service.deleteBatch(this.batchId); }
    catch { /* even if delete fails, leave the batch view */ }
    void this.router.navigate(['/capture/batch']);
  }

  finish(): void {
    this.service.clearActiveBatch(this.batchId);
    void this.router.navigate(['/sets']);
  }

  private setBusy(id: string, busy: boolean): void {
    this.mutateSet(this.busyIds, s => (busy ? s.add(id) : s.delete(id)));
  }
  private setItemError(id: string, message: string): void {
    this.mutateMap(this.itemErrors, m => (message ? m.set(id, message) : m.delete(id)));
  }
  private mutateSet(sig: WritableSignal<ReadonlySet<string>>, mutate: (s: Set<string>) => void): void {
    const next = new Set(sig());
    mutate(next);
    sig.set(next);
  }
  private mutateMap<V>(sig: WritableSignal<ReadonlyMap<string, V>>, mutate: (m: Map<string, V>) => void): void {
    const next = new Map(sig());
    mutate(next);
    sig.set(next);
  }
}
