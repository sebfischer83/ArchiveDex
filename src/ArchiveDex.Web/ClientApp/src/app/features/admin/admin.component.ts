import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TuiButton, TuiTextfield, TuiLabel } from '@taiga-ui/core';
import { TuiSelect, TuiDataListWrapper, TuiBadge } from '@taiga-ui/kit';
import { TranslatePipe } from '../../core/translate.pipe';
import { TranslateService } from '../../core/translate.service';
import { A11yModule } from '@angular/cdk/a11y';
import { LoadingStateComponent, EmptyStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { userSafeErrorMessage } from '../../core/api-error-mapper';

interface PendingMappingDto {
  id: string;
  incomingSource: string;
  incomingLanguage: string;
  incomingExternalId: string;
  incomingName: string;
  incomingReleaseDate: string | null;
  incomingPrintedTotal: number | null;
  suggestedCardSetId: string | null;
  suggestedCardSetName: string | null;
  score: number;
  reasons: string[];
  status: string;
}

@Component({
  selector: 'app-admin',
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
    TranslatePipe,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    A11yModule,
  ],
  template: `
    <h2 class="tui-text_h3">{{ 'admin.title' | translate }}</h2>

    <section>
      <h3>{{ 'admin.pendingMappings' | translate }}</h3>

      @if (loading) {
        <app-loading-state></app-loading-state>
      } @else if (loadError) {
        <app-error-state [message]="loadError" (retry)="loadPendingMappings()"></app-error-state>
      } @else if (mappings.length === 0) {
        <app-empty-state [message]="'admin.noPendingMappings' | translate"></app-empty-state>
      } @else {
        @if (actionError) { <p class="action-error" role="alert">{{ actionError }}</p> }
        @if (actionSuccess) { <p class="action-success" role="status">{{ actionSuccess }}</p> }

        <div class="mappings-list">
          @for (mapping of mappings; track mapping.id) {
            <div class="mapping-card" [class.mapping-processed]="mapping.status !== 'Pending'">
              <div class="mapping-header">
                <div>
                  <strong>{{ mapping.incomingName }}</strong>
                  <span class="mapping-id">({{ mapping.incomingExternalId }})</span>
                </div>
                <tui-badge>{{ mapping.status }}</tui-badge>
              </div>

              <div class="mapping-details">
                <div class="detail-row">
                  <span class="detail-label">{{ 'admin.incomingSource' | translate }}</span>
                  <span>{{ mapping.incomingSource }}/{{ mapping.incomingLanguage }}</span>
                </div>

                @if (mapping.incomingReleaseDate) {
                  <div class="detail-row">
                    <span class="detail-label">Release Date</span>
                    <span>{{ mapping.incomingReleaseDate }}</span>
                  </div>
                }
                @if (mapping.incomingPrintedTotal !== null) {
                  <div class="detail-row">
                    <span class="detail-label">Printed Total</span>
                    <span>{{ mapping.incomingPrintedTotal }}</span>
                  </div>
                }

                @if (mapping.suggestedCardSetName) {
                  <div class="detail-row">
                    <span class="detail-label">{{ 'admin.suggestedSet' | translate }}</span>
                    <span>{{ mapping.suggestedCardSetName }}</span>
                  </div>
                }

                <div class="detail-row">
                  <span class="detail-label">{{ 'admin.score' | translate }}</span>
                  <span [class.high-score]="mapping.score >= 80" [class.low-score]="mapping.score < 50">
                    {{ mapping.score }}%
                  </span>
                </div>

                @if (mapping.reasons.length) {
                  <div class="detail-row">
                    <span class="detail-label">{{ 'admin.reasons' | translate }}</span>
                    <div class="reasons-list">
                      @for (r of mapping.reasons; track r) {
                        <span class="reason-chip">{{ r }}</span>
                      }
                    </div>
                  </div>
                }
              </div>

              @if (mapping.status === 'Pending') {
                <div class="mapping-actions">
                  @if (mapping.suggestedCardSetId) {
                    <button
                      tuiButton
                      appearance="primary"
                      size="s"
                      (click)="acceptMapping(mapping, mapping.suggestedCardSetId!)"
                      [disabled]="processingId === mapping.id"
                    >
                      {{ 'admin.accept' | translate }}
                    </button>
                  }
                  <button
                    tuiButton
                    appearance="secondary-destructive"
                    size="s"
                    (click)="rejectMapping(mapping)"
                    [disabled]="processingId === mapping.id"
                  >
                    {{ 'admin.reject' | translate }}
                  </button>
                  <button
                    tuiButton
                    appearance="secondary"
                    size="s"
                    (click)="createNewSet(mapping)"
                    [disabled]="processingId === mapping.id"
                  >
                    {{ 'admin.createNew' | translate }}
                  </button>
                  <button
                    tuiButton
                    appearance="outline"
                    size="s"
                      (click)="openRelationDialog(mapping)"
                    [disabled]="processingId === mapping.id"
                  >
                    {{ 'admin.createRelation' | translate }}
                  </button>
                </div>
              }
            </div>
          }
        </div>

        @if (showRelationDialog) {
          <div class="dialog-overlay">
            <div class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="relation-dialog-title" cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
              <h4 id="relation-dialog-title">{{ 'admin.createRelation' | translate }}</h4>
              <p>Create relation for <strong>{{ relationMapping?.incomingName }}</strong></p>

              <tui-textfield>
                <label tuiLabel>Target Card Set ID</label>
                <input tuiTextfield [(ngModel)]="relationTargetId" name="relationTargetId" placeholder="00000000-0000-0000-0000-000000000000" />
              </tui-textfield>

              <tui-select
                [ngModel]="relationType"
                (ngModelChange)="relationType = $event"
              >
                Relation Type
                <tui-data-list-wrapper *tuiDataList [items]="relationTypes"></tui-data-list-wrapper>
              </tui-select>

              <div class="dialog-actions">
                <button tuiButton appearance="primary" size="m" (click)="doCreateRelation()">
                  {{ 'admin.createRelation' | translate }}
                </button>
                <button tuiButton appearance="secondary" size="m" (click)="closeRelationDialog()">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        }
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .mappings-list { display: flex; flex-direction: column; gap: 1rem; }
    .mapping-card { padding: 1.25rem; border: 1px solid var(--tui-border-normal); border-radius: 0.75rem; }
    .mapping-processed { opacity: 0.65; }
    .mapping-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
    .mapping-id { color: var(--tui-text-secondary); font-size: 0.875rem; margin-left: 0.5rem; }
    .mapping-details { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
    .detail-row { display: flex; gap: 0.75rem; font-size: 0.875rem; }
    .detail-label { color: var(--tui-text-secondary); min-width: 7rem; flex-shrink: 0; }
    .reasons-list { display: flex; flex-wrap: wrap; gap: 0.375rem; }
    .reason-chip { padding: 0.125rem 0.5rem; background: var(--tui-surface-neutral); border-radius: 0.75rem; font-size: 0.8125rem; }
    .high-score { color: var(--tui-text-positive); font-weight: 600; }
    .low-score { color: var(--tui-text-negative); font-weight: 600; }
    .mapping-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .action-error { color: var(--tui-text-negative); margin-bottom: 1rem; }
    .action-success { color: var(--tui-text-positive); margin-bottom: 1rem; }
    .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .dialog-card { width: min(32rem, calc(100vw - 2rem)); max-height: calc(100vh - 2rem); overflow: auto; background: var(--tui-surface-elevated); padding: 1.5rem; border-radius: 0.75rem; display: flex; flex-direction: column; gap: 1rem; }
    .dialog-card h4 { margin: 0; }
    .dialog-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }
  `],
})
export class AdminComponent implements OnInit {
  loading = true;
  loadError = '';
  actionError = '';
  actionSuccess = '';
  processingId: string | null = null;
  mappings: PendingMappingDto[] = [];

  showRelationDialog = false;
  relationMapping: PendingMappingDto | null = null;
  relationTargetId = '';
  relationType = 'SameSet';
  relationTypes = ['SameSet', 'PartOf', 'Contains', 'DerivedFrom', 'InternationalEquivalent', 'Unknown'];
  private relationTrigger?: HTMLElement;

  constructor(
    private http: HttpClient,
    private translations: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    void this.loadPendingMappings();
  }

  async loadPendingMappings(): Promise<void> {
    this.loading = true;
    this.loadError = '';
    try {
      this.mappings = await firstValueFrom(this.http.get<PendingMappingDto[]>('/api/sets/pending'));
    } catch {
      this.loadError = this.translations.translate('states.error');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async acceptMapping(mapping: PendingMappingDto, cardSetId: string): Promise<void> {
    this.actionError = '';
    this.actionSuccess = '';
    this.processingId = mapping.id;
    try {
      await firstValueFrom(
        this.http.post(`/api/sets/pending/${mapping.id}/accept`, { cardSetId }),
      );
      mapping.status = 'Accepted';
      this.actionSuccess = `Mapping for "${mapping.incomingName}" accepted.`;
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Mapping action failed.');
    } finally {
      this.processingId = null;
    }
  }

  async rejectMapping(mapping: PendingMappingDto): Promise<void> {
    this.actionError = '';
    this.actionSuccess = '';
    this.processingId = mapping.id;
    try {
      await firstValueFrom(this.http.post(`/api/sets/pending/${mapping.id}/reject`, {}));
      mapping.status = 'Rejected';
      this.actionSuccess = `Mapping for "${mapping.incomingName}" rejected.`;
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Reject failed.');
    } finally {
      this.processingId = null;
    }
  }

  async createNewSet(mapping: PendingMappingDto): Promise<void> {
    this.actionError = '';
    this.actionSuccess = '';
    this.processingId = mapping.id;
    try {
      await firstValueFrom(this.http.post(`/api/sets/pending/${mapping.id}/create-new`, {}));
      mapping.status = 'Created';
      this.actionSuccess = `New set created from "${mapping.incomingName}".`;
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Create set failed.');
    } finally {
      this.processingId = null;
    }
  }

  openRelationDialog(mapping: PendingMappingDto): void {
    if (document.activeElement instanceof HTMLElement) this.relationTrigger = document.activeElement;
    this.relationMapping = mapping;
    this.relationTargetId = '';
    this.relationType = 'SameSet';
    this.showRelationDialog = true;
  }

  closeRelationDialog(): void {
    this.showRelationDialog = false;
    this.relationMapping = null;
    queueMicrotask(() => this.relationTrigger?.focus());
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showRelationDialog) this.closeRelationDialog();
  }

  async doCreateRelation(): Promise<void> {
    if (!this.relationMapping || !this.relationTargetId) return;
    this.actionError = '';
    this.actionSuccess = '';
    this.processingId = this.relationMapping.id;
    this.showRelationDialog = false;
    try {
      await firstValueFrom(
        this.http.post(`/api/sets/pending/${this.relationMapping.id}/relation`, {
          targetCardSetId: this.relationTargetId,
          relationType: this.relationType,
        }),
      );
      this.actionSuccess = `Relation created for "${this.relationMapping.incomingName}".`;
    } catch (e: unknown) {
      this.actionError = userSafeErrorMessage(e, this.translations, 'Create relation failed.');
    } finally {
      this.processingId = null;
      this.relationMapping = null;
    }
  }
}
