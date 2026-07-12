import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TuiButton, TuiTextfield, TuiLabel } from '@taiga-ui/core';
import { TuiSelect, TuiDataListWrapper, TuiBadgedContent, TuiBadge, TuiTabs } from '@taiga-ui/kit';
import { TranslatePipe } from '../../core/translate.pipe';
import { TranslateService } from '../../core/translate.service';
import { LoadingStateComponent, EmptyStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { userSafeErrorMessage } from '../../core/api-error-mapper';

interface CatalogImportRunDto {
  id: string;
  status: string;
  mode: string;
  isDryRun: boolean;
  downloadImages: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  importedCount: number;
  updatedCount: number;
  mergedCount: number;
  skippedCount: number;
  addedCount: number;
  errorCount: number;
  warningCount: number;
  checkpoints: Array<{
    source: string;
    language: string;
    phase: string;
    isCompleted: boolean;
    processedCount: number;
  }>;
}

interface CatalogImportReportDto {
  run: CatalogImportRunDto;
  sourceSummaries: Array<{
    source: string;
    language: string;
    setsProcessed: number;
    cardsProcessed: number;
    errors: number;
    warnings: number;
  }>;
  imageSummary: {
    selectedImages: number;
    failedDownloads: number;
    cardsWithoutImages: number;
    candidatesAnalyzed: number;
  };
  pendingMappingCount: number;
  ambiguousCardCount: number;
}

interface ImportJobSummaryResponse {
  id: string;
  source: string;
  status: string;
  importedCount: number;
  updatedCount: number;
  mergedCount: number;
  skippedCount: number;
  errors: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

interface ImportErrorDto {
  code: string;
  message: string;
  source: string | null;
  language: string | null;
  externalId: string | null;
}

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiButton,
    TuiBadge,
    TuiTextfield,
    TuiLabel,
    TuiSelect,
    TuiDataListWrapper,
    TuiBadgedContent,
    ...TuiTabs,
    TranslatePipe,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  template: `
    <h2 class="tui-text_h3">{{ 'import.title' | translate }}</h2>

    <nav tuiTabs [(activeItemIndex)]="activeTabIndex">
      <button tuiTab>{{ 'import.fullImport' | translate }}</button>
      <button tuiTab>{{ 'import.legacyImport' | translate }}</button>
    </nav>

    @if (activeTabIndex === 0) {
      <section class="tab-content">
        @if (loadingActive) {
          <app-loading-state></app-loading-state>
        } @else if (activeRunError) {
          <app-error-state [message]="activeRunError" (retry)="loadActiveImport()"></app-error-state>
        } @else if (activeImport) {
          <div class="active-run">
            <div class="run-header">
              <h3>{{ activeImport.mode }} @if (activeImport.isDryRun) { ({{ 'import.dryRun' | translate }}) }</h3>
              <tui-badge>{{ activeImport.status }}</tui-badge>
            </div>

            <div class="stats-grid">
              <div class="stat"><span class="stat-value">{{ activeImport.importedCount }}</span><span class="stat-label">Imported</span></div>
              <div class="stat"><span class="stat-value">{{ activeImport.updatedCount }}</span><span class="stat-label">Updated</span></div>
              <div class="stat"><span class="stat-value">{{ activeImport.skippedCount }}</span><span class="stat-label">Skipped</span></div>
              <div class="stat"><span class="stat-value">{{ activeImport.errorCount }}</span><span class="stat-label">Errors</span></div>
              <div class="stat"><span class="stat-value">{{ activeImport.warningCount }}</span><span class="stat-label">Warnings</span></div>
            </div>

            <div class="checkpoints">
              <h4>Checkpoints</h4>
              @for (cp of activeImport.checkpoints; track cp.source + cp.language + cp.phase) {
                <div class="checkpoint">
                  <span class="cp-name">{{ cp.source }}/{{ cp.language }} - {{ cp.phase }}</span>
                  <tui-badge [appearance]="cp.isCompleted ? 'success' : 'neutral'">{{ cp.isCompleted ? 'Done' : 'Pending' }}</tui-badge>
                  <span class="cp-count">{{ cp.processedCount }}</span>
                </div>
              }
            </div>

            <div class="run-actions">
              <button tuiButton appearance="primary-destructive" size="m" (click)="cancelActiveImport()">
                {{ 'import.cancel' | translate }}
              </button>
              @if (activeImport.status === 'Paused' || activeImport.status === 'Failed') {
                <button tuiButton appearance="primary" size="m" (click)="resumeActiveImport()">
                  {{ 'import.resume' | translate }}
                </button>
              }
            </div>

            @if (report) {
              <div class="report-section">
                <h4>{{ 'import.report' | translate }}</h4>
                <p>Pending mappings: {{ report.pendingMappingCount }} | Ambiguous cards: {{ report.ambiguousCardCount }}</p>
                <div class="image-summary">
                  <span>Images: {{ report.imageSummary.selectedImages }} selected, {{ report.imageSummary.failedDownloads }} failed, {{ report.imageSummary.cardsWithoutImages }} missing</span>
                </div>
                @for (s of report.sourceSummaries; track s.source + s.language) {
                  <div class="source-summary">
                    <strong>{{ s.source }}/{{ s.language }}</strong>: {{ s.setsProcessed }} sets, {{ s.cardsProcessed }} cards, {{ s.errors }} errors, {{ s.warnings }} warnings
                  </div>
                }
              </div>
            }

            @if (importErrors.length) {
              <div class="errors-section">
                <h4>Errors</h4>
                @for (e of importErrors; track e.code) {
                  <div class="error-item">
                    <span class="error-code">{{ e.code }}</span>
                    <span>{{ e.message }}</span>
                    @if (e.source && e.language) { <span class="error-loc">({{ e.source }}/{{ e.language }})</span> }
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <app-empty-state [message]="'import.noActiveImport' | translate"></app-empty-state>
          <div class="start-import-form">
            <h3>{{ 'import.startImport' | translate }}</h3>
            <form (ngSubmit)="startImport()">
              <tui-textfield>
                <label tuiLabel>{{ 'import.sources' | translate }}</label>
                <input tuiTextfield [(ngModel)]="importSources" name="sources" placeholder="source1,source2" />
              </tui-textfield>
              <tui-textfield>
                <label tuiLabel>{{ 'import.languages' | translate }}</label>
                <input tuiTextfield [(ngModel)]="importLanguages" name="languages" placeholder="en,de" />
              </tui-textfield>

              <tui-select [ngModel]="importMode" (ngModelChange)="importMode = $event">



                {{ 'import.mode' | translate }}
                <tui-data-list-wrapper *tuiDataList [items]="importModes"></tui-data-list-wrapper>
              </tui-select>

              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="importDryRun" name="dryRun" />
                {{ 'import.dryRun' | translate }}
              </label>
              <label class="checkbox-label"><input type="checkbox" [(ngModel)]="downloadImages" name="downloadImages" />{{ 'import.downloadImages' | translate }}</label>
              <label class="checkbox-label"><input type="checkbox" [(ngModel)]="reanalyzeImages" name="reanalyzeImages" />{{ 'import.reanalyzeImages' | translate }}</label>

              <button tuiButton appearance="primary" size="m" type="submit" [disabled]="startingImport">
                {{ 'import.startImport' | translate }}
              </button>
            </form>
            @if (startError) { <p class="error-message" role="alert">{{ startError }}</p> }
          </div>
        }
      </section>
    }

    @if (activeTabIndex === 1) {
      <section class="tab-content">
        <form class="selective-form" (ngSubmit)="startSelectiveImport()">
          <h3>{{ 'import.selectiveImport' | translate }}</h3>
          <label>{{ 'import.sources' | translate }}<select [(ngModel)]="selectedSource" name="source" (ngModelChange)="sourceChanged()">@for (source of availableSources; track source) { <option [value]="source">{{ source }}</option> }</select></label>
          <label>{{ 'import.language' | translate }}<select [(ngModel)]="selectedLanguage" name="language" (ngModelChange)="loadImportSets()">@for (language of sourceLanguages[selectedSource] || []; track language) { <option [value]="language">{{ language }}</option> }</select></label>
          <div class="set-options">@for (set of availableSets; track set.setId) { <label><input type="checkbox" [checked]="selectedSetIds.has(set.setId)" (change)="toggleSet(set.setId)" />{{ set.name }} ({{ set.cardCount }})</label> }</div>
          <button tuiButton type="submit" [disabled]="startingSelective || !selectedSource || !selectedLanguage">{{ 'import.startImport' | translate }}</button>
          @if (selectiveError) { <p class="error-message" role="alert">{{ selectiveError }}</p> }
        </form>
        @if (loadingLegacy) {
          <app-loading-state></app-loading-state>
        } @else if (legacyError) {
          <app-error-state [message]="legacyError" (retry)="loadLegacyJobs()"></app-error-state>
        } @else if (legacyJobs.length === 0) {
          <app-empty-state message="No legacy import jobs found."></app-empty-state>
        } @else {
          <div class="legacy-jobs">
            @for (job of legacyJobs; track job.id) {
              <div class="legacy-job">
                <div class="job-header">
                  <strong>{{ job.source }}</strong>
                  <tui-badge>{{ job.status }}</tui-badge>
                </div>
                <div class="job-stats">
                  <span>Imported: {{ job.importedCount }}</span>
                  <span>Updated: {{ job.updatedCount }}</span>
                  <span>Skipped: {{ job.skippedCount }}</span>
                </div>
                @if (job.errors) {
                  <p class="job-error">{{ job.errors }}</p>
                }
                @if (job.startedAt) { <small>Started: {{ job.startedAt | date:'medium' }}</small> }
                @if (job.finishedAt) { <small>Finished: {{ job.finishedAt | date:'medium' }}</small> }
              </div>
            }
          </div>
        }
      </section>
    }
  `,
  styles: [`
    :host { display: block; }
    .tab-content { padding-top: 1.5rem; }
    .run-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
    .stat { display: flex; flex-direction: column; align-items: center; padding: 0.75rem; background: var(--tui-surface-neutral); border-radius: 0.5rem; }
    .stat-value { font-size: 1.25rem; font-weight: 600; }
    .stat-label { font-size: 0.75rem; color: var(--tui-text-secondary); }
    .checkpoints { margin-bottom: 1.5rem; }
    .checkpoint { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--tui-border-normal); }
    .cp-name { flex: 1; }
    .cp-count { color: var(--tui-text-secondary); font-size: 0.875rem; }
    .run-actions { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    .report-section { margin-bottom: 1.5rem; padding: 1rem; background: var(--tui-surface-neutral); border-radius: 0.5rem; }
    .report-section h4 { margin-top: 0; }
    .source-summary { padding: 0.25rem 0; font-size: 0.875rem; }
    .image-summary { margin-bottom: 0.75rem; font-size: 0.875rem; }
    .errors-section { margin-bottom: 1.5rem; }
    .error-item { display: flex; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--tui-border-normal); font-size: 0.875rem; }
    .error-code { font-weight: 600; color: var(--tui-text-negative); min-width: 5rem; }
    .error-loc { color: var(--tui-text-secondary); }
    .start-import-form { max-width: 32rem; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; }
    .error-message { color: var(--tui-text-negative); }
    .legacy-jobs { display: flex; flex-direction: column; gap: 1rem; }
    .legacy-job { padding: 1rem; border: 1px solid var(--tui-border-normal); border-radius: 0.5rem; }
    .job-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
    .job-stats { display: flex; gap: 1rem; font-size: 0.875rem; }
    .job-error { color: var(--tui-text-negative); margin: 0.5rem 0; font-size: 0.875rem; }
    .selective-form { max-width: 42rem; margin-bottom: 2rem; padding: 1rem; border: 1px solid var(--tui-border-normal); border-radius: .6rem; }
    .selective-form label { display:flex; flex-direction:column; gap:.3rem; }
    .selective-form select { min-height:2.6rem; padding:.4rem; background:var(--tui-background-base); color:inherit; border:1px solid var(--tui-border-normal); border-radius:.4rem; }
    .set-options { display:grid; grid-template-columns:1fr 1fr; gap:.4rem; max-height:16rem; overflow:auto; }
    .set-options label { flex-direction:row; align-items:center; }
  `],
})
export class ImportComponent implements OnInit, OnDestroy {
  activeTabIndex = 0;
  loadingActive = true;
  loadingLegacy = true;
  loadingReport = false;
  loadingErrors = false;
  startingImport = false;
  activeRunError = '';
  legacyError = '';
  startError = '';
  activeImport: CatalogImportRunDto | null = null;
  report: CatalogImportReportDto | null = null;
  importErrors: ImportErrorDto[] = [];
  legacyJobs: ImportJobSummaryResponse[] = [];
  importSources = '';
  importMode = 'Update';
  importDryRun = false;
  importModes = ['Update', 'AddOnly'];
  importLanguages = 'en';
  downloadImages = true;
  reanalyzeImages = false;
  availableSources: string[] = [];
  sourceLanguages: Record<string, string[]> = {};
  availableSets: Array<{ setId: string; name: string; cardCount: number }> = [];
  selectedSource = '';
  selectedLanguage = '';
  selectedSetIds = new Set<string>();
  startingSelective = false;
  selectiveError = '';

  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private http: HttpClient,
    private translations: TranslateService,
  ) {}

  ngOnInit(): void {
    void this.loadActiveImport();
    void this.loadLegacyJobs();
    void this.loadSources();
  }

  ngOnDestroy(): void { this.stopPolling(); }

  async loadSources(): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.get<{ sources: string[]; sourceLanguages: Record<string, string[]> }>('/api/import/sources'));
      this.availableSources = response.sources;
      this.sourceLanguages = response.sourceLanguages;
      this.selectedSource = response.sources[0] ?? '';
      this.sourceChanged();
    } catch (error: unknown) { this.selectiveError = this.errorMessage(error, 'Could not load import sources.'); }
  }

  sourceChanged(): void {
    this.selectedLanguage = this.sourceLanguages[this.selectedSource]?.[0] ?? '';
    this.selectedSetIds = new Set();
    void this.loadImportSets();
  }

  async loadImportSets(): Promise<void> {
    if (!this.selectedSource || !this.selectedLanguage) { this.availableSets = []; return; }
    try {
      this.availableSets = await firstValueFrom(this.http.get<typeof this.availableSets>('/api/import/sets', {
        params: { source: this.selectedSource, cardLanguage: this.selectedLanguage },
      }));
    } catch (error: unknown) { this.selectiveError = this.errorMessage(error, 'Could not load import sets.'); }
  }

  toggleSet(id: string): void {
    const selected = new Set(this.selectedSetIds);
    selected.has(id) ? selected.delete(id) : selected.add(id);
    this.selectedSetIds = selected;
  }

  async startSelectiveImport(): Promise<void> {
    this.startingSelective = true;
    this.selectiveError = '';
    try {
      await firstValueFrom(this.http.post('/api/import/jobs', {
        source: this.selectedSource,
        setIds: [...this.selectedSetIds],
        cardLanguages: [this.selectedLanguage],
      }));
      await this.loadLegacyJobs();
    } catch (error: unknown) { this.selectiveError = this.errorMessage(error, 'Could not start selective import.'); }
    finally { this.startingSelective = false; }
  }

  async loadActiveImport(): Promise<void> {
    this.loadingActive = true;
    this.activeRunError = '';
    try {
      this.activeImport = await firstValueFrom(this.http.get<CatalogImportRunDto>('/api/catalog-imports/active'));
      if (this.activeImport) {
        await this.loadReport();
        await this.loadErrors();
        if (this.isRunningStatus(this.activeImport.status)) this.startPolling();
        else this.stopPolling();
      }
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 404) this.activeImport = null;
      else this.activeRunError = this.errorMessage(error, 'Could not load active import.');
    } finally {
      this.loadingActive = false;
    }
  }

  async loadReport(): Promise<void> {
    if (!this.activeImport) return;
    this.loadingReport = true;
    try {
      this.report = await firstValueFrom(
        this.http.get<CatalogImportReportDto>(`/api/catalog-imports/${this.activeImport.id}/report`),
      );
    } catch {
      this.report = null;
    } finally {
      this.loadingReport = false;
    }
  }

  async loadErrors(): Promise<void> {
    if (!this.activeImport) return;
    this.loadingErrors = true;
    try {
      this.importErrors = await firstValueFrom(
        this.http.get<ImportErrorDto[]>(`/api/catalog-imports/${this.activeImport.id}/errors?severity=Error`),
      );
    } catch {
      this.importErrors = [];
    } finally {
      this.loadingErrors = false;
    }
  }

  async loadLegacyJobs(): Promise<void> {
    this.loadingLegacy = true;
    this.legacyError = '';
    try {
      this.legacyJobs = await firstValueFrom(this.http.get<ImportJobSummaryResponse[]>('/api/import/jobs'));
    } catch {
      this.legacyError = this.translations.translate('states.error');
    } finally {
      this.loadingLegacy = false;
    }
  }

  async startImport(): Promise<void> {
    this.startingImport = true;
    this.startError = '';
    try {
      const sources = this.importSources
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const languages = this.importLanguages.split(',').map(value => value.trim()).filter(Boolean);
      const languagesBySource: Record<string, string[]> = {};
      for (const source of sources) {
        languagesBySource[source] = languages;
      }
      this.activeImport = await firstValueFrom(
        this.http.post<CatalogImportRunDto>('/api/catalog-imports', {
          sources,
          languagesBySource,
          dryRun: this.importDryRun,
          downloadImages: this.downloadImages,
          reanalyzeExistingImages: this.reanalyzeImages,
          mode: this.importMode,
        }),
      );
      this.importSources = '';
      this.importDryRun = false;
      await this.refreshActiveImport();
      this.startPolling();
    } catch (e: unknown) {
      this.startError = this.errorMessage(e, 'Import start failed.');
    } finally {
      this.startingImport = false;
    }
  }

  async cancelActiveImport(): Promise<void> {
    if (!this.activeImport) return;
    try {
      await firstValueFrom(this.http.post(`/api/catalog-imports/${this.activeImport.id}/cancel`, {}));
      await this.loadActiveImport();
    } catch (e: unknown) {
      this.startError = this.errorMessage(e, 'Cancel failed.');
    }
  }

  async resumeActiveImport(): Promise<void> {
    if (!this.activeImport) return;
    try {
      await firstValueFrom(this.http.post(`/api/catalog-imports/${this.activeImport.id}/resume`, {}));
      await this.loadActiveImport();
    } catch (e: unknown) {
      this.startError = this.errorMessage(e, 'Resume failed.');
    }
  }

  private isRunningStatus(status: string): boolean {
    return status === 'Pending' || status === 'Running' || status === 'Cancelling';
  }

  private startPolling(): void {
    this.stopPolling();
    this.refreshTimer = setInterval(() => {
      void this.refreshActiveImport();
    }, 5000);
  }

  private stopPolling(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private async refreshActiveImport(): Promise<void> {
    if (!this.activeImport) return;
    try {
      this.activeImport = await firstValueFrom(
        this.http.get<CatalogImportRunDto>(`/api/catalog-imports/${this.activeImport.id}`),
      );
      await Promise.all([this.loadReport(), this.loadErrors()]);
      if (!this.isRunningStatus(this.activeImport.status)) this.stopPolling();
    } catch {
      this.stopPolling();
    }
  }

  private errorMessage(error: unknown, fallback: string): string {
    return userSafeErrorMessage(error, this.translations, fallback);
  }
}
