import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TranslatePipe } from '../../core/translate.service';
import { LoadingStateComponent, EmptyStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { Router } from '@angular/router';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

interface SetSummary {
  id: string; setName: string; language: string; distinctCardCount: number; specimenCount: number;
  valuedSpecimenCount: number; valuationAmountMinor: number;
}
interface ValuationRefreshJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'completedWithErrors' | 'failed';
  totalCards: number;
  processedCards: number;
  updatedCards: number;
  unavailableCards: number;
  failedCards: number;
  lastError: string | null;
}
interface DataImportResult {
  setsCreated: number; setsReused: number;
  cardsCreated: number; cardsReused: number;
  specimensCreated: number; specimensSkipped: number;
}

@Component({
  selector: 'app-set-overview',
  standalone: true,
  imports: [TranslatePipe, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, TuiButton, TuiTitle, TuiCardLarge],
  template: `
    <div class="toolbar">
      <div>
        <h2 tuiTitle>{{ 'sets.title' | translate }}</h2>
        @if (sets().length) {
          <span class="collection-value">{{ collectionValueText() }}</span>
        }
      </div>
      <button tuiButton type="button" size="m" [disabled]="refreshRunning()" (click)="startPriceRefresh()">
        {{ refreshRunning() ? 'Preise werden aktualisiert …' : 'Alle Preise aktualisieren' }}
      </button>
    </div>
    <section class="data-transfer">
      <div>
        <strong>Datenübertragung</strong>
        <small>Vollständige Sammlung inklusive Bildern, Zuständen und Preisen als ArchiveDex-ZIP.</small>
      </div>
      <div class="transfer-actions">
        <a tuiButton appearance="secondary" size="m" href="/api/v1/data-transfer/export">Daten exportieren</a>
        <input #importInput hidden type="file" accept=".zip,application/zip" (change)="importArchive($event)" />
        <button tuiButton appearance="secondary" type="button" size="m" [disabled]="importing()" (click)="importInput.click()">
          {{ importing() ? 'Import läuft …' : 'Daten importieren' }}
        </button>
      </div>
      @if (importing()) { <progress max="100" [value]="importProgress()"></progress> }
      @if (importMessage()) { <small>{{ importMessage() }}</small> }
      @if (importError()) { <small class="job-error">{{ importError() }}</small> }
    </section>
    @if (valuationJob(); as job) {
      <section class="valuation-status" aria-live="polite">
        <div>
          <strong>{{ statusText(job) }}</strong>
          <span>{{ job.processedCards }} / {{ job.totalCards }} Karten</span>
        </div>
        <progress [max]="job.totalCards || 1" [value]="job.processedCards"></progress>
        <small>
          {{ job.updatedCards }} aktualisiert · {{ job.unavailableCards }} ohne belastbaren Preis
          @if (job.failedCards) { · {{ job.failedCards }} fehlgeschlagen }
        </small>
        @if (job.lastError && job.status === 'failed') { <small class="job-error">{{ job.lastError }}</small> }
      </section>
    }
    @if (refreshError()) { <p class="job-error">{{ refreshError() }}</p> }
    @if (loading()) { <app-loading-state /> }
    @else if (error()) { <app-error-state [message]="error()" (retry)="load()" /> }
    @else if (sets().length === 0) { <app-empty-state [message]="'sets.empty' | translate" /> }
    @else {
      <div class="grid">
        @for (s of sets(); track s.id) {
          <button tuiCardLarge="compact" class="card" (click)="openSet(s.id)">
            <span tuiTitle>
              {{ s.setName }}
              <span tuiSubtitle>{{ s.language }} · {{ s.distinctCardCount }} Karten · {{ s.specimenCount }} Exemplare</span>
              <span class="estimated-value">{{ valueText(s.valuationAmountMinor, s.valuedSpecimenCount, s.specimenCount, 'Set-Gesamtwert') }}</span>
            </span>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap}
    .data-transfer{display:grid;gap:.65rem;padding:1rem;margin-bottom:1rem;border:1px solid var(--tui-border-normal);border-radius:.75rem}
    .data-transfer>div:first-child{display:grid;gap:.25rem}.transfer-actions{display:flex;gap:.65rem;flex-wrap:wrap}.data-transfer progress{width:100%}
    .valuation-status{display:grid;gap:.45rem;padding:1rem;margin-bottom:1rem;border-radius:.75rem;background:var(--tui-background-neutral-1)}
    .valuation-status div{display:flex;justify-content:space-between;gap:1rem}.valuation-status progress{width:100%}
    .job-error{color:var(--tui-text-negative)}
    .collection-value,.estimated-value{display:block;color:var(--tui-text-secondary);font-size:.875rem;margin-top:.25rem}
    .estimated-value{color:var(--tui-text-primary);font-weight:600}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:1rem}.card{text-align:left;cursor:pointer;width:100%}
  `],
})
export class SetOverviewComponent implements OnInit, OnDestroy {
  readonly sets = signal<SetSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly valuationJob = signal<ValuationRefreshJob | null>(null);
  readonly refreshRunning = signal(false);
  readonly refreshError = signal('');
  readonly importing = signal(false);
  readonly importProgress = signal(0);
  readonly importMessage = signal('');
  readonly importError = signal('');
  readonly collectionValueMinor = computed(() => this.sets().reduce((sum, set) => sum + set.valuationAmountMinor, 0));
  readonly collectionSpecimens = computed(() => this.sets().reduce((sum, set) => sum + set.specimenCount, 0));
  readonly collectionValuedSpecimens = computed(() => this.sets().reduce((sum, set) => sum + set.valuedSpecimenCount, 0));
  private readonly eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  private pollHandle: ReturnType<typeof setTimeout> | undefined;
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit() { void this.load(); void this.loadPriceRefresh(); }
  ngOnDestroy() { if (this.pollHandle) clearTimeout(this.pollHandle); }
  async load() {
    this.loading.set(true); this.error.set('');
    try { const p = await firstValueFrom(this.http.get<{ items: SetSummary[] }>('/api/v1/sets')); this.sets.set(p.items); }
    catch { this.error.set('Collection could not be loaded.'); }
    finally { this.loading.set(false); }
  }
  async startPriceRefresh() {
    if (!window.confirm('Für jede Karte und jeden unterschiedlichen Zustand wird eine OpenAI-Websuche ausgeführt. Preisaktualisierung jetzt starten?')) return;
    this.refreshRunning.set(true); this.refreshError.set('');
    try {
      const job = await firstValueFrom(this.http.post<ValuationRefreshJob>('/api/v1/valuations/refresh-all', {}));
      this.valuationJob.set(job);
      this.schedulePoll();
    } catch {
      this.refreshRunning.set(false);
      this.refreshError.set('Die Preisaktualisierung konnte nicht gestartet werden. Prüfe den OpenAI-Schlüssel.');
    }
  }
  importArchive(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!window.confirm('Der Import ergänzt die Sammlung und überschreibt keine vorhandenen Karten. Import jetzt starten?')) return;

    this.importing.set(true); this.importProgress.set(0); this.importMessage.set(''); this.importError.set('');
    this.http.post<DataImportResult>('/api/v1/data-transfer/import', file, {
      headers: { 'Content-Type': 'application/zip' }, observe: 'events', reportProgress: true,
    }).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total)
          this.importProgress.set(Math.round(100 * event.loaded / event.total));
        if (event.type === HttpEventType.Response) {
          const result = event.body!;
          this.importing.set(false); this.importProgress.set(100);
          this.importMessage.set(`${result.setsCreated} Sets, ${result.cardsCreated} Karten und ${result.specimensCreated} Exemplare importiert; ${result.specimensSkipped} bereits vorhanden.`);
          void this.load();
        }
      },
      error: () => {
        this.importing.set(false);
        this.importError.set('Der Import ist fehlgeschlagen. Die Datei ist ungültig oder überschreitet das Größenlimit.');
      },
    });
  }
  async loadPriceRefresh() {
    try {
      const wasRunning = this.refreshRunning();
      const job = await firstValueFrom(this.http.get<ValuationRefreshJob | null>('/api/v1/valuations/refresh-all'));
      this.valuationJob.set(job);
      const active = job?.status === 'pending' || job?.status === 'running';
      this.refreshRunning.set(active);
      if (active) this.schedulePoll();
      else if (wasRunning) await this.load();
    } catch { /* Die Sammlung bleibt auch ohne Jobstatus nutzbar. */ }
  }
  statusText(job: ValuationRefreshJob): string {
    if (job.status === 'pending') return 'Preisaktualisierung wartet';
    if (job.status === 'running') return 'Preisaktualisierung läuft';
    if (job.status === 'completed') return 'Alle Preise wurden geprüft';
    if (job.status === 'completedWithErrors') return 'Preisaktualisierung mit einzelnen Fehlern abgeschlossen';
    return 'Preisaktualisierung wurde angehalten';
  }
  collectionValueText(): string {
    return this.valueText(
      this.collectionValueMinor(),
      this.collectionValuedSpecimens(),
      this.collectionSpecimens(),
      'Geschätzter Sammlungswert');
  }
  valueText(amountMinor: number, valued: number, total: number, label: string): string {
    if (valued === 0) return 'Noch kein Schätzwert';
    const incomplete = valued < total;
    return `${incomplete ? 'Teilwert' : label}: ${this.eur.format(amountMinor / 100)}`
      + (incomplete ? ` · ${valued} von ${total} Exemplaren bewertet` : '');
  }
  private schedulePoll() {
    if (this.pollHandle) clearTimeout(this.pollHandle);
    this.pollHandle = setTimeout(() => void this.loadPriceRefresh(), 2000);
  }
  openSet(id: string) { void this.router.navigate(['/sets', id, 'cards']); }
}
