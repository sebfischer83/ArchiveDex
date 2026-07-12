import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TuiButton } from '@taiga-ui/core';
import { TuiBadge, TuiTabs } from '@taiga-ui/kit';
import { TranslatePipe } from '../../core/translate.pipe';
import { TranslateService } from '../../core/translate.service';
import { LoadingStateComponent, EmptyStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { userSafeErrorMessage } from '../../core/api-error-mapper';

interface CatalogTransferOperationDto {
  id: string;
  kind: string;
  status: string;
  phase: string;
  packageId: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  processedRecords: number;
  totalRecords: number;
  processedImages: number;
  totalImages: number;
  validationSucceeded: boolean | null;
  errorCount: number;
  warningCount: number;
}

interface CatalogTransferReportDto {
  operation: CatalogTransferOperationDto;
  categoryCounts: Record<string, number>;
  errors: Array<{
    code: string;
    message: string;
    impact: string;
    recommendedAction: string;
  }>;
}

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    TuiButton,
    TuiBadge,
    ...TuiTabs,
    TranslatePipe,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  template: `
    <h2 class="tui-text_h3">{{ 'transfer.title' | translate }}</h2>

    <nav tuiTabs [(activeItemIndex)]="activeTabIndex">
      <button tuiTab>{{ 'transfer.export' | translate }}</button>
      <button tuiTab>{{ 'transfer.import' | translate }}</button>
    </nav>

    <!-- Export tab -->
    @if (activeTabIndex === 0) {
      <section class="tab-content">
        @if (loadingActive) {
          <app-loading-state></app-loading-state>
        } @else if (activeError) {
          <app-error-state [message]="activeError" (retry)="loadActiveOperation()"></app-error-state>
        } @else if (activeOperation && isExport(activeOperation)) {
          <div class="active-operation">
            <div class="op-header">
              <h3>Export: {{ activeOperation.status }}</h3>
              <tui-badge>{{ activeOperation.status }}</tui-badge>
            </div>

            <div class="progress-section">
              <div class="progress-bar" role="progressbar" aria-label="Export progress" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="progressPercent()">
                <div class="progress-fill" [style.width.%]="progressPercent()"></div>
              </div>
              <span class="progress-text">{{ activeOperation.processedRecords }} / {{ activeOperation.totalRecords }} records</span>
            </div>

            <div class="stats-row">
              <span>Images: {{ activeOperation.processedImages }} / {{ activeOperation.totalImages }}</span>
              <span>Errors: {{ activeOperation.errorCount }}</span>
              <span>Warnings: {{ activeOperation.warningCount }}</span>
            </div>

            <div class="op-actions">
              @if (activeOperation.packageId) {
                <a tuiButton appearance="primary" size="m" [href]="'/api/catalog-transfers/' + activeOperation.id + '/package'">
                  {{ 'transfer.download' | translate }}
                </a>
              }
              <button tuiButton appearance="primary-destructive" size="m" (click)="cancelOperation()">
                {{ 'transfer.cancel' | translate }}
              </button>
            </div>

            @if (report) {
              <div class="report-section">
                <h4>{{ 'transfer.report' | translate }}</h4>
                <div class="category-counts">
                  @for (cat of categoryEntries; track cat[0]) {
                    <span class="category-chip">{{ cat[0] }}: {{ cat[1] }}</span>
                  }
                </div>
                @if (report.errors.length) {
                  <div class="transfer-errors">
                    <h5>Issues</h5>
                    @for (err of report.errors; track err.code) {
                      <div class="transfer-error">
                        <strong>{{ err.code }}</strong>: {{ err.message }}
                        <div class="error-detail">Impact: {{ err.impact }} | Action: {{ err.recommendedAction }}</div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <app-empty-state [message]="'transfer.noActive' | translate"></app-empty-state>
          <div class="start-action">
            <button tuiButton appearance="primary" size="m" (click)="startExport()" [disabled]="starting">
              {{ 'transfer.startExport' | translate }}
            </button>
            @if (actionError) { <p class="error-message" role="alert">{{ actionError }}</p> }
          </div>
        }
      </section>
    }

    <!-- Import tab -->
    @if (activeTabIndex === 1) {
      <section class="tab-content">
        @if (loadingActive) {
          <app-loading-state></app-loading-state>
        } @else if (activeError) {
          <app-error-state [message]="activeError" (retry)="loadActiveOperation()"></app-error-state>
        } @else if (activeOperation && isImport(activeOperation)) {
          <div class="active-operation">
            <div class="op-header">
              <h3>Import: {{ activeOperation.status }}</h3>
              <tui-badge>{{ activeOperation.status }}</tui-badge>
            </div>

            @if (activeOperation.validationSucceeded !== null) {
              <p>Validation: {{ activeOperation.validationSucceeded ? 'Passed' : 'Failed' }}</p>
            }

            <div class="progress-section">
              <div class="progress-bar" role="progressbar" aria-label="Import progress" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="progressPercent()">
                <div class="progress-fill" [style.width.%]="progressPercent()"></div>
              </div>
              <span class="progress-text">{{ activeOperation.processedRecords }} / {{ activeOperation.totalRecords }} records</span>
            </div>

            <div class="stats-row">
              <span>Images: {{ activeOperation.processedImages }} / {{ activeOperation.totalImages }}</span>
              <span>Errors: {{ activeOperation.errorCount }}</span>
              <span>Warnings: {{ activeOperation.warningCount }}</span>
            </div>

            <div class="op-actions">
              <button tuiButton appearance="primary-destructive" size="m" (click)="cancelOperation()">
                {{ 'transfer.cancel' | translate }}
              </button>
            </div>

            @if (report) {
              <div class="report-section">
                <h4>{{ 'transfer.report' | translate }}</h4>
                <div class="category-counts">
                  @for (cat of categoryEntries; track cat[0]) {
                    <span class="category-chip">{{ cat[0] }}: {{ cat[1] }}</span>
                  }
                </div>
                @if (report.errors.length) {
                  <div class="transfer-errors">
                    <h5>Issues</h5>
                    @for (err of report.errors; track err.code) {
                      <div class="transfer-error">
                        <strong>{{ err.code }}</strong>: {{ err.message }}
                        <div class="error-detail">Impact: {{ err.impact }} | Action: {{ err.recommendedAction }}</div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <app-empty-state [message]="'transfer.noActive' | translate"></app-empty-state>

          <div class="import-steps">
            <div class="step">
              <h4>{{ 'transfer.uploadPackage' | translate }}</h4>
              <label for="catalog-package">{{ 'transfer.uploadPackage' | translate }}</label>
              <input
                id="catalog-package"
                type="file"
                (change)="onFileSelected($event)"
                accept=".zip,.archivex"
                style="margin-bottom: 0.75rem;"
              />
              <button tuiButton appearance="secondary" size="m" (click)="validatePackage()" [disabled]="!selectedFile || validating">
                {{ 'transfer.validate' | translate }}
              </button>
              @if (validationResult) {
                <p [class.success]="validationResult.valid" [class.error]="!validationResult.valid">
                  {{ validationResult.message }}
                </p>
              }
            </div>

            @if (importId) {
              <div class="step">
                <button tuiButton appearance="primary" size="m" (click)="startImportRestore()" [disabled]="starting">
                  {{ 'transfer.startImport' | translate }}
                </button>
              </div>
            }

            @if (actionError) { <p class="error-message" role="alert">{{ actionError }}</p> }
          </div>
        }
      </section>
    }
  `,
  styles: [`
    :host { display: block; }
    .tab-content { padding-top: 1.5rem; }
    .active-operation { max-width: 48rem; }
    .op-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .progress-section { margin-bottom: 1rem; }
    .progress-bar { height: 0.75rem; background: var(--tui-surface-neutral); border-radius: 0.375rem; overflow: hidden; margin-bottom: 0.5rem; }
    .progress-fill { height: 100%; background: var(--tui-primary); border-radius: 0.375rem; transition: width 0.3s; }
    .progress-text { font-size: 0.875rem; color: var(--tui-text-secondary); }
    .stats-row { display: flex; gap: 1.5rem; font-size: 0.875rem; margin-bottom: 1rem; }
    .op-actions { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    .report-section { margin-bottom: 1.5rem; padding: 1rem; background: var(--tui-surface-neutral); border-radius: 0.5rem; }
    .report-section h4 { margin-top: 0; }
    .category-counts { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
    .category-chip { padding: 0.25rem 0.75rem; background: var(--tui-surface-elevated); border-radius: 1rem; font-size: 0.875rem; }
    .transfer-errors h5 { margin: 0 0 0.5rem; }
    .transfer-error { padding: 0.5rem 0; border-bottom: 1px solid var(--tui-border-normal); font-size: 0.875rem; }
    .error-detail { color: var(--tui-text-secondary); margin-top: 0.25rem; font-size: 0.8125rem; }
    .start-action, .import-steps { max-width: 32rem; padding-top: 1rem; }
    .step { margin-bottom: 1.5rem; }
    .error-message { color: var(--tui-text-negative); margin-top: 0.5rem; }
    .success { color: var(--tui-text-positive); }
    .error { color: var(--tui-text-negative); }
  `],
})
export class TransferComponent implements OnInit, OnDestroy {
  activeTabIndex = 0;
  loadingActive = true;
  starting = false;
  validating = false;
  activeError = '';
  actionError = '';
  activeOperation: CatalogTransferOperationDto | null = null;
  report: CatalogTransferReportDto | null = null;
  selectedFile: File | null = null;
  importId: string | null = null;
  validationResult: { valid: boolean; message: string } | null = null;

  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private http: HttpClient,
    private translations: TranslateService,
  ) {}

  ngOnInit(): void {
    void this.loadActiveOperation();
  }

  ngOnDestroy(): void { this.stopPolling(); }

  get categoryEntries(): [string, number][] {
    if (!this.report) return [];
    return Object.entries(this.report.categoryCounts);
  }

  progressPercent(): number {
    const op = this.activeOperation;
    if (!op || op.totalRecords === 0) return 0;
    return Math.round((op.processedRecords / op.totalRecords) * 100);
  }

  isExport(op: CatalogTransferOperationDto): boolean {
    return op.kind === 'Export';
  }

  isImport(op: CatalogTransferOperationDto): boolean {
    return op.kind === 'Import';
  }

  async loadActiveOperation(): Promise<void> {
    this.loadingActive = true;
    this.activeError = '';
    try {
      this.activeOperation = await firstValueFrom(
        this.http.get<CatalogTransferOperationDto>('/api/catalog-transfers/active'),
      );
      if (this.activeOperation && this.isInProgress(this.activeOperation.status)) {
        await this.loadReport();
        this.startPolling();
      } else {
        this.stopPolling();
      }
    } catch {
      this.activeOperation = null;
    } finally {
      this.loadingActive = false;
    }
  }

  async loadReport(): Promise<void> {
    if (!this.activeOperation) return;
    try {
      this.report = await firstValueFrom(
        this.http.get<CatalogTransferReportDto>(`/api/catalog-transfers/${this.activeOperation.id}/report`),
      );
    } catch {
      this.report = null;
    }
  }

  async startExport(): Promise<void> {
    this.starting = true;
    this.actionError = '';
    try {
      await firstValueFrom(this.http.post('/api/catalog-transfers/exports', {}));
      await this.loadActiveOperation();
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Export start failed.');
    } finally {
      this.starting = false;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.validationResult = null;
    }
  }

  async validatePackage(): Promise<void> {
    if (!this.selectedFile) return;
    this.validating = true;
    this.actionError = '';
    try {
      const formData = new FormData();
      formData.append('package', this.selectedFile);
      const result = await firstValueFrom(
        this.http.post<CatalogTransferOperationDto>(
          '/api/catalog-transfers/imports/validate',
          formData,
        ),
      );
      const validated = await this.pollValidation(result.id);
      this.activeOperation = validated;
      this.importId = validated.validationSucceeded === true ? validated.id : null;
      this.validationResult = {
        valid: validated.validationSucceeded === true,
        message: validated.validationSucceeded === true ? 'Package validated successfully.' : 'Package validation failed.',
      };
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Package validation failed.');
      this.validationResult = null;
    } finally {
      this.validating = false;
    }
  }

  async startImportRestore(): Promise<void> {
    if (!this.importId) return;
    this.starting = true;
    this.actionError = '';
    try {
      await firstValueFrom(this.http.post(`/api/catalog-transfers/imports/${this.importId}/start`, {}));
      this.importId = null;
      this.selectedFile = null;
      this.validationResult = null;
      await this.loadActiveOperation();
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Import restore start failed.');
    } finally {
      this.starting = false;
    }
  }

  async cancelOperation(): Promise<void> {
    if (!this.activeOperation) return;
    try {
      await firstValueFrom(this.http.post(`/api/catalog-transfers/${this.activeOperation.id}/cancel`, {}));
      await this.loadActiveOperation();
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Cancel failed.');
    }
  }

  private startPolling(): void {
    this.stopPolling();
    this.refreshTimer = setInterval(() => {
      void this.loadActiveOperation();
    }, 5000);
  }

  private stopPolling(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private isInProgress(status: string): boolean {
    return ['Pending', 'Validating', 'Running', 'Cancelling'].includes(status);
  }

  private async pollValidation(operationId: string): Promise<CatalogTransferOperationDto> {
    for (let attempt = 0; attempt < 120; attempt++) {
      const operation = await firstValueFrom(
        this.http.get<CatalogTransferOperationDto>(`/api/catalog-transfers/${operationId}`),
      );
      if (operation.validationSucceeded !== null || !this.isInProgress(operation.status)) return operation;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error('Package validation timed out.');
  }
}
