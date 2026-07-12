import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TuiButton, TuiDataList, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TranslatePipe } from '../../core/translate.pipe';
import { LoadingStateComponent, EmptyStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { userSafeErrorMessage } from '../../core/api-error-mapper';

interface ScanStatus {
  id: string;
  status: string;
  imageUrl: string;
  ocr: {
    detectedNumber: string | null;
    detectedName: string | null;
    detectedCardLanguage: string | null;
    detectedSetHint: string | null;
    confidence: number | null;
    candidates: Array<{
      cardId: string;
      score: number;
      number: string;
      name: string;
      rarity: string | null;
      cardLanguage: string | null;
    }>;
  } | null;
}

interface UploadResponse {
  id: string;
  status: string;
  imageUrl: string;
}

type ViewState = 'idle' | 'uploading' | 'scanning' | 'ocr-complete' | 'confirmed' | 'error';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiButton,
    TuiTextfield,
    TuiLabel,
    TuiBadge,
    TuiDataList,
    TranslatePipe,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  template: `
    <h2 class="tui-text_h3">{{ 'scan.title' | translate }}</h2>

    @if (state === 'uploading') {
      <app-loading-state></app-loading-state>
    } @else if (state === 'scanning') {
      <div class="scanning-section">
        @if (scan?.imageUrl) {
          <img [src]="scan.imageUrl" alt="Scanned card" class="scan-image" />
        }
        <app-loading-state [message]="'scan.scanning' | translate"></app-loading-state>
      </div>
    } @else if (state === 'error') {
      <app-error-state [message]="error" (retry)="reset()"></app-error-state>
    } @else if (state === 'confirmed') {
      <div class="result-message">
        <p>{{ 'scan.ocrComplete' | translate }}</p>
        <button tuiButton type="button" appearance="primary" (click)="reset()">{{ 'scan.upload' | translate }}</button>
      </div>
    } @else if (state === 'ocr-complete' && scan) {
      <div class="scan-result">
        <h3 class="tui-text_h5">{{ 'scan.ocrComplete' | translate }}</h3>
        @if (scan.imageUrl) {
          <img [src]="scan.imageUrl" alt="Scanned card" class="scan-image" />
        }

        @if (scan.ocr) {
          <div class="ocr-details">
            @if (scan.ocr.detectedNumber) {
              <p><strong>Number:</strong> {{ scan.ocr.detectedNumber }}</p>
            }
            @if (scan.ocr.detectedName) {
              <p><strong>Name:</strong> {{ scan.ocr.detectedName }}</p>
            }
            @if (scan.ocr.detectedCardLanguage) {
              <p><strong>Language:</strong> {{ scan.ocr.detectedCardLanguage }}</p>
            }
            @if (scan.ocr.detectedSetHint) {
              <p><strong>Set:</strong> {{ scan.ocr.detectedSetHint }}</p>
            }
            @if (scan.ocr.confidence !== null) {
              <tui-badge>
                {{ 'scan.confidence' | translate }}: {{ scan.ocr.confidence | percent }}
              </tui-badge>
            }
          </div>

          @if (scan.ocr.candidates && scan.ocr.candidates.length > 0) {
            <h4>Candidates</h4>
            <tui-data-list>
              @for (candidate of scan.ocr.candidates; track candidate.cardId) {
                <button
                  type="button"
                  class="candidate"
                  [class.selected]="selectedCandidateId === candidate.cardId"
                  [attr.aria-pressed]="selectedCandidateId === candidate.cardId"
                  (click)="selectedCandidateId = candidate.cardId"
                >
                  <span class="candidate-name">{{ candidate.number }} &mdash; {{ candidate.name }}</span>
                  @if (candidate.rarity) {
                    <tui-badge>{{ candidate.rarity }}</tui-badge>
                  }
                  @if (candidate.cardLanguage) {
                    <tui-badge>{{ candidate.cardLanguage }}</tui-badge>
                  }
                  <span class="score">{{ candidate.score | number:'1.0-2' }}</span>
                </button>
              }
            </tui-data-list>
          } @else {
            <app-empty-state [message]="'scan.noCandidates' | translate"></app-empty-state>
          }

          <div class="confirmation-fields">
            <label>{{ 'collection.condition' | translate }}
              <select [(ngModel)]="condition">@for (item of conditions; track item) { <option [value]="item">{{ item }}</option> }</select>
            </label>
            <label>{{ 'collection.quantity' | translate }}<input type="number" min="1" [(ngModel)]="quantity" /></label>
            <label>{{ 'collection.purchasePrice' | translate }}<input type="number" min="0" step="0.01" [(ngModel)]="purchasePrice" /></label>
            <label>{{ 'collection.storageLocation' | translate }}<input [(ngModel)]="storageLocation" /></label>
            <label>{{ 'collection.notes' | translate }}<textarea [(ngModel)]="notes"></textarea></label>
          </div>
          @if (confirmationError) { <p class="confirmation-error" role="alert">{{ confirmationError }}</p> }

          <div class="actions">
            <button
              tuiButton
              type="button"
              appearance="primary"
              (click)="confirm()"
              [disabled]="confirming || rejecting || !selectedCandidateId"
            >
              {{ 'scan.confirm' | translate }}
            </button>
            <button
              tuiButton
              type="button"
              appearance="secondary-destructive"
              (click)="reject()"
              [disabled]="confirming || rejecting"
            >
              {{ 'scan.reject' | translate }}
            </button>
          </div>
        }
      </div>
    } @else {
      <div class="upload-section">
        <tui-textfield>
          <label tuiLabel>{{ 'scan.selectImage' | translate }}</label>
          <input tuiTextfield [value]="selectedFile?.name ?? ''" readonly />
        </tui-textfield>
        <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
        <div class="upload-actions">
          <button tuiButton type="button" appearance="secondary" (click)="fileInput.click()">
            {{ 'scan.selectImage' | translate }}
          </button>
          <button
            tuiButton
            type="button"
            appearance="primary"
            (click)="upload()"
            [disabled]="!selectedFile"
          >
            {{ 'scan.upload' | translate }}
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .scan-result {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .scan-image {
        max-width: 300px;
        border-radius: 12px;
      }
      .ocr-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .ocr-details p {
        margin: 0;
      }
      .candidate {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
      }
      .candidate-name {
        flex: 1;
      }
      .score {
        color: var(--tui-text-secondary);
        font-size: 0.875rem;
        margin-left: auto;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .confirmation-fields { display:grid; grid-template-columns:repeat(2,minmax(10rem,1fr)); gap:.75rem; max-width:40rem; }
      .confirmation-fields label { display:flex; flex-direction:column; gap:.3rem; }
      .confirmation-fields input,.confirmation-fields select,.confirmation-fields textarea { min-height:2.6rem; padding:.45rem .65rem; border:1px solid var(--tui-border-normal); border-radius:.4rem; background:var(--tui-background-base); color:inherit; }
      .confirmation-fields textarea { min-height:4rem; }
      .confirmation-error { color:var(--tui-text-negative); }
      @media(max-width:36rem){.confirmation-fields{grid-template-columns:1fr}}
      .upload-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 28rem;
      }
      .upload-actions {
        display: flex;
        gap: 0.5rem;
      }
      .result-message {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    `,
  ],
})
export class ScanComponent implements OnDestroy {
  state: ViewState = 'idle';
  error = '';
  selectedFile: File | null = null;
  scan: ScanStatus | null = null;
  confirming = false;
  rejecting = false;
  selectedCandidateId: string | null = null;
  readonly conditions = ['NM', 'LP', 'MP', 'HP', 'DMG'];
  condition = 'NM';
  quantity = 1;
  purchasePrice: number | null = null;
  storageLocation = '';
  notes = '';
  confirmationError = '';

  private pollTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  async upload(): Promise<void> {
    if (!this.selectedFile) return;
    this.state = 'uploading';
    this.error = '';
    try {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      const response = await firstValueFrom(
        this.http.post<UploadResponse>('/api/scans', formData),
      );
      this.scan = { ...response, ocr: null };
      this.state = 'scanning';
      this.pollScan(response.id);
    } catch (error: unknown) {
      this.error = userSafeErrorMessage(error, undefined, 'Upload failed');
      this.state = 'error';
    }
  }

  async pollScan(scanId: string): Promise<void> {
    try {
      const scan = await firstValueFrom(
        this.http.get<ScanStatus>(`/api/scans/${scanId}`),
      );
      this.scan = scan;
      if (scan.status === 'OcrComplete') {
        this.state = 'ocr-complete';
        this.cdr.markForCheck();
        return;
      }
      if (scan.status === 'Failed') {
        this.error = 'Scan failed';
        this.state = 'error';
        this.cdr.markForCheck();
        return;
      }
      this.pollTimer = setTimeout(() => this.pollScan(scanId), 2000);
    } catch (error: unknown) {
      this.error = userSafeErrorMessage(error, undefined, 'Failed to check scan status');
      this.state = 'error';
      this.cdr.markForCheck();
    }
  }

  async confirm(): Promise<void> {
    if (!this.scan || !this.selectedCandidateId) return;
    if (this.quantity < 1 || (this.purchasePrice !== null && this.purchasePrice < 0)) {
      this.confirmationError = 'Check quantity and purchase price.';
      return;
    }
    this.confirming = true;
    this.confirmationError = '';
    try {
      await firstValueFrom(
        this.http.post(`/api/scans/${this.scan.id}/confirm`, {
          cardId: this.selectedCandidateId,
          condition: this.condition,
          quantity: this.quantity,
          purchasePrice: this.purchasePrice,
          storageLocation: this.storageLocation || null,
          notes: this.notes || null,
        }),
      );
      this.state = 'confirmed';
    } catch (error: unknown) {
      this.confirmationError = userSafeErrorMessage(error, undefined, 'Confirmation failed');
    } finally {
      this.confirming = false;
      this.cdr.markForCheck();
    }
  }

  async reject(): Promise<void> {
    if (!this.scan) return;
    this.rejecting = true;
    try {
      await firstValueFrom(
        this.http.post(`/api/scans/${this.scan.id}/reject`, {}),
      );
      this.state = 'idle';
      this.scan = null;
      this.selectedFile = null;
      this.selectedCandidateId = null;
    } catch (error: unknown) {
      this.error = userSafeErrorMessage(error, undefined, 'Rejection failed');
      this.state = 'error';
    } finally {
      this.rejecting = false;
      this.cdr.markForCheck();
    }
  }

  reset(): void {
    this.clearPollTimer();
    this.state = 'idle';
    this.error = '';
    this.scan = null;
    this.selectedFile = null;
    this.selectedCandidateId = null;
    this.condition = 'NM';
    this.quantity = 1;
    this.purchasePrice = null;
    this.storageLocation = '';
    this.notes = '';
    this.confirmationError = '';
  }

  private clearPollTimer(): void {
    if (this.pollTimer !== null) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearPollTimer();
  }
}
