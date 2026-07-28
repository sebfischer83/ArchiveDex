import { Component, DestroyRef, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { from, mergeMap } from 'rxjs';
import { BatchItem, BatchSummary, Capture, CaptureService, SetOverride, detectSetOverride } from './capture.service';
import { CaptureReviewFormComponent, CaptureSaved } from './capture-review-form.component';
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

        @if (croppedCount() > 0) {
          <div class="crop-choice" role="group" aria-label="Bildvariante für den Batch">
            <span>
              Bei {{ croppedCount() }} von {{ s.counts.needsReview }} Karten wurde ein Zuschnitt erkannt.
            </span>
            <div class="crop-choice-actions">
              <button tuiButton size="s" type="button"
                [appearance]="cropPreference() ? 'primary' : 'flat'"
                (click)="setCropPreference(true)">Zugeschnitten speichern</button>
              <button tuiButton size="s" type="button"
                [appearance]="cropPreference() ? 'flat' : 'primary'"
                (click)="setCropPreference(false)">Original speichern</button>
            </div>
          </div>
        }
        @if (pendingOverride(); as pending) {
          <div class="set-offer" role="status">
            <div>
              <strong>Set korrigiert auf „{{ pending.setName }}"</strong>
              <span>
                {{ pending.setIdentifier }} · {{ pending.language }} — auf die übrigen
                {{ s.counts.needsReview }} zu prüfenden Karten übernehmen?
              </span>
            </div>
            <div class="set-offer-actions">
              <button tuiButton size="s" appearance="primary" type="button" (click)="applyOverride()">Übernehmen</button>
              <button tuiButton size="s" appearance="flat" type="button" (click)="dismissOverride()">Nur diese Karte</button>
            </div>
          </div>
        }
        @if (setOverride(); as active) {
          <div class="set-active" role="status">
            <span>
              Set für diesen Batch: <strong>{{ active.setName }}</strong> ({{ active.setIdentifier }} · {{ active.language }})
            </span>
            <button tuiButton size="s" appearance="flat" type="button" (click)="clearOverride()">Aufheben</button>
          </div>
        }

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
                  <app-capture-review-form
                    [setOverride]="setOverride()"
                    [capture]="capture"
                    submitLabel="Speichern"
                    (saved)="onSaved(item, capture, $event)"
                  />
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
    .set-offer{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:space-between;
      padding:.75rem 1rem;border-radius:var(--tui-radius-l);
      background:var(--tui-background-neutral-1);border:1px solid var(--tui-border-focus)}
    .set-offer>div:first-child{display:flex;flex-direction:column;gap:.15rem;min-width:0}
    .set-offer span{color:var(--tui-text-secondary);font-size:.875rem}
    .set-offer-actions{display:flex;gap:.5rem;flex-wrap:wrap}
    .crop-choice{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:space-between;
      padding:.5rem .75rem;border-radius:var(--tui-radius-l);background:var(--tui-background-neutral-1);
      color:var(--tui-text-secondary);font-size:.875rem}
    .crop-choice-actions{display:flex;gap:.35rem;flex-wrap:wrap}
    .set-active{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between;
      padding:.4rem .75rem;border-radius:var(--tui-radius-l);background:var(--tui-background-neutral-1);
      color:var(--tui-text-secondary);font-size:.875rem}
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

  /**
   * A set correction the reviewer just made, offered for reuse. Applying it is an explicit click:
   * a batch may legitimately hold cards from several sets, so it must never happen silently.
   */
  readonly pendingOverride = signal<SetOverride | null>(null);
  /** Correction currently applied to every remaining card of this batch. */
  readonly setOverride = signal<SetOverride | null>(null);

  /**
   * Which image variant bulk actions store for this batch. Defaults to the cut-out, since one is
   * only offered where a card was actually detected. Cards without a crop are unaffected.
   */
  readonly cropPreference = signal(true);
  readonly croppedCount = computed(() =>
    (this.summary()?.items ?? []).filter(x => x.status === 'needsReview' && x.hasCrop).length);

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
    this.restoreOverride();
    try {
      const stored = globalThis.localStorage?.getItem(`archivedex.batch.${id}.crop`);
      if (stored !== null && stored !== undefined) this.cropPreference.set(stored === 'true');
    } catch { /* Storage can be unavailable in restricted browser contexts. */ }
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
      await this.service.acceptProposed(item.captureId, this.setOverride(), this.cropPreference());
    } catch {
      this.setItemError(item.captureId, 'Konnte nicht gespeichert werden.');
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

  onSaved(item: BatchItem, capture: Capture, saved: CaptureSaved): void {
    this.mutateSet(this.expandedIds, s => s.delete(item.captureId));
    this.mutateMap(this.fullCaptures, m => m.delete(item.captureId));

    // Offer the correction for the rest of the batch, unless it is already what we are applying.
    const correction = detectSetOverride(capture, saved.reviewed);
    if (correction && !this.sameSet(correction, this.setOverride()))
      this.pendingOverride.set(correction);
  }

  setCropPreference(useCrop: boolean): void {
    this.cropPreference.set(useCrop);
    try {
      globalThis.localStorage?.setItem(`archivedex.batch.${this.batchId}.crop`, String(useCrop));
    } catch { /* Storage can be unavailable in restricted browser contexts. */ }
  }

  applyOverride(): void {
    const pending = this.pendingOverride();
    if (!pending) return;
    this.setOverride.set(pending);
    this.pendingOverride.set(null);
    this.persistOverride(pending);
  }

  dismissOverride(): void {
    this.pendingOverride.set(null);
  }

  clearOverride(): void {
    this.setOverride.set(null);
    this.persistOverride(null);
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

  /** Accept without prompting; exact duplicate images become additional specimens. */
  private async acceptQuiet(item: BatchItem): Promise<void> {
    try {
      await this.service.acceptProposed(item.captureId, this.setOverride(), this.cropPreference());
    } catch {
      this.setItemError(item.captureId, 'Konnte nicht gespeichert werden.');
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

  private sameSet(a: SetOverride, b: SetOverride | null): boolean {
    return b !== null
      && a.setIdentifier === b.setIdentifier
      && a.setName === b.setName
      && a.language === b.language;
  }

  /** Reviewing a batch spans many minutes, so the choice has to survive a reload. */
  private get overrideStorageKey(): string { return `archivedex.batch.${this.batchId}.setOverride`; }

  private persistOverride(value: SetOverride | null): void {
    try {
      if (value) globalThis.localStorage?.setItem(this.overrideStorageKey, JSON.stringify(value));
      else globalThis.localStorage?.removeItem(this.overrideStorageKey);
    } catch { /* Storage can be unavailable in restricted browser contexts. */ }
  }

  private restoreOverride(): void {
    try {
      const raw = globalThis.localStorage?.getItem(this.overrideStorageKey);
      if (raw) this.setOverride.set(JSON.parse(raw) as SetOverride);
    } catch { /* A corrupt entry simply means no override. */ }
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
