import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TuiButton, TuiLabel, TuiTextfield, TuiDataList } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { LoadingStateComponent, EmptyStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { TranslatePipe } from '../../core/translate.pipe';
import { userSafeErrorMessage } from '../../core/api-error-mapper';
import { ActivatedRoute, Router } from '@angular/router';

interface BatchScanJobDto {
  id: string; status: string; createdAt: string; completedAt: string | null;
  itemCount: number; acceptedCount: number; rejectedCount: number;
  noMatchCount: number; pendingCount: number;
}

interface BatchScanItemSummary {
  id: string; sortOrder: number; imageUrl: string | null;
  matchStatus: string; isReviewed: boolean;
  detectedName: string | null; detectedNumber: string | null;
  confidence: number | null; matchedCardName: string | null;
  matchedCardNumber: string | null; failureReason: string | null;
}

interface BatchScanItemDetail {
  id: string; batchId: string; sortOrder: number; imageUrl: string | null;
  matchStatus: string; isReviewed: boolean; matchedCardPrintId: string | null;
  ocrResult: { detectedNumber: string | null; detectedName: string | null; detectedCardLanguage: string | null; detectedSetHint: string | null; confidence: number | null; rawText: string | null; } | null;
  candidateMatches: Array<{ cardPrintId: string; name: string; number: string; setName: string; score: number; }>;
  collectionEntryId: string | null; failureReason: string | null; isDuplicateInBatch: boolean;
}

@Component({
  selector: 'app-batch-scan',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiButton, TuiLabel, TuiTextfield, TuiDataList, TuiBadge, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, TranslatePipe],
  template: `
    <section>
      <h2>{{ 'batchScan.title' | translate }}</h2>

      @if (loading) {
        <app-loading-state />
      } @else if (error) {
        <app-error-state [message]="error" (retry)="loadActive()" />
      } @else if (!active) {
        <app-empty-state [message]="'batchScan.noActiveBatch' | translate" />
        <form (ngSubmit)="startBatch()" style="margin-top:1rem">
          <tui-textfield>
            <label tuiLabel>Upload batch images</label>
            <input tuiTextfield type="file" (change)="onFilesSelected($event)" multiple accept="image/*" />
          </tui-textfield>
          <button tuiButton type="submit" appearance="primary" [disabled]="!selectedFiles.length || starting">
            {{ 'batchScan.start' | translate }}
          </button>
        </form>
      } @else {
        @if (active) {
          <div class="batch-stats">
            <tui-badge appearance="info">{{ active.status }}</tui-badge>
            <span>{{ 'batchScan.itemCount' | translate }}: {{ active.itemCount }}</span>
            <span>{{ 'batchScan.pending' | translate }}: {{ active.pendingCount }}</span>
            <span>{{ 'batchScan.accepted' | translate }}: {{ active.acceptedCount }}</span>
          </div>
          <button tuiButton (click)="acceptAll()" [disabled]="!hasAcceptableItems()">
            {{ 'batchScan.acceptAll' | translate }}
          </button>
          <button tuiButton appearance="secondary-destructive" (click)="discardBatch()">{{ 'batchScan.discard' | translate }}</button>
          <div class="review-controls">
            <label>{{ 'batchScan.filter' | translate }}<select [(ngModel)]="statusFilter" (ngModelChange)="loadBatch()"><option value="all">{{ 'batchScan.all' | translate }}</option><option value="matched">Matched</option><option value="unmatched">Unmatched</option><option value="reviewed">Reviewed</option></select></label>
            <label>{{ 'collection.condition' | translate }}<select [(ngModel)]="defaultCondition">@for (condition of conditions; track condition) { <option [value]="condition">{{ condition }}</option> }</select></label>
            <label>{{ 'collection.quantity' | translate }}<input type="number" min="1" [(ngModel)]="defaultQuantity" /></label>
            <label>{{ 'collection.purchasePrice' | translate }}<input type="number" min="0" step=".01" [(ngModel)]="defaultPurchasePrice" /></label>
            <label>{{ 'collection.storageLocation' | translate }}<input [(ngModel)]="defaultStorageLocation" /></label>
            <label>{{ 'collection.notes' | translate }}<input [(ngModel)]="defaultNotes" /></label>
          </div>
        }

        @for (item of items; track item.id) {
          <div class="batch-item" [class.selected]="selectedItemId === item.id">
            <input type="checkbox" [checked]="selectedItemIds.has(item.id)" (change)="toggleSelected(item.id)" [attr.aria-label]="'Select item ' + item.sortOrder" />
            <button type="button" class="item-open" [attr.aria-pressed]="selectedItemId === item.id" (click)="selectItem(item.id)">
            @if (item.imageUrl) {
              <img [src]="item.imageUrl" [alt]="'Card image ' + item.sortOrder" class="item-thumb" />
            }
            <div>
              <span>{{ item.detectedName || 'batchScan.unmatched' | translate }}</span>
              <tui-badge appearance="neutral">{{ item.matchStatus }}</tui-badge>
            </div>
            </button>
          </div>
        }

        @if (selectedDetail) {
          <div class="detail-panel">
            <h3>{{ 'batchScan.detail' | translate }}</h3>
            @for (c of selectedDetail.candidateMatches; track c.cardPrintId) {
              <div class="candidate">
                <span>{{ c.name }} (#{{ c.number }})</span>
                <tui-badge>{{ c.score }}</tui-badge>
                <button tuiButton size="s" (click)="matchItem(selectedItemId!, c.cardPrintId)">
                  {{ 'batchScan.match' | translate }}
                </button>
              </div>
            }
            <button tuiButton size="s" appearance="secondary" (click)="noMatch(selectedItemId!)">
              {{ 'batchScan.noMatch' | translate }}
            </button>
            <button tuiButton size="s" appearance="secondary-destructive" (click)="rejectItem(selectedItemId!)">{{ 'batchScan.reject' | translate }}</button>
            <label class="catalog-search">{{ 'collection.cardSearch' | translate }}<input [(ngModel)]="catalogQuery" (ngModelChange)="searchCatalog()" /></label>
            @for (card of catalogResults; track card.id) { <button class="catalog-result" type="button" (click)="matchItem(selectedItemId!, card.id)">{{ card.number }} · {{ card.name }} ({{ card.cardLanguage }})</button> }
          </div>
        }
        @if (actionError) { <p class="error" role="alert">{{ actionError }}</p> }
      }
    </section>
  `,
  styles: [`
    .batch-stats { display: flex; gap: 1rem; align-items: center; margin: 1rem 0; flex-wrap: wrap; }
    .batch-item { display: flex; width: 100%; gap: .75rem; align-items: center; padding: 0.75rem; border: 1px solid var(--tui-border-normal); border-radius: 8px; margin: 0.5rem 0; color: inherit; background: transparent; }
    .item-open { display:flex;align-items:center;gap:1rem;flex:1;border:0;background:none;color:inherit;text-align:left;cursor:pointer; }
    .batch-item.selected { border-color: var(--tui-primary); background: var(--tui-background-neutral-1); }
    .item-thumb { width: 64px; height: 64px; object-fit: contain; }
    .detail-panel { margin-top: 1.5rem; padding: 1rem; background: var(--tui-background-neutral-1); border-radius: 8px; }
    .candidate { display: flex; gap: 0.75rem; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--tui-border-normal); }
    .review-controls { display:grid;grid-template-columns:repeat(3,minmax(10rem,1fr));gap:.75rem;margin:1rem 0; }
    .review-controls label,.catalog-search{display:flex;flex-direction:column;gap:.3rem}.review-controls input,.review-controls select,.catalog-search input{min-height:2.5rem;padding:.4rem;border:1px solid var(--tui-border-normal);border-radius:.4rem;background:var(--tui-background-base);color:inherit}.catalog-result{display:block;width:100%;padding:.5rem;border:0;border-bottom:1px solid var(--tui-border-normal);background:none;color:inherit;text-align:left}.error{color:var(--tui-text-negative)}
    @media(max-width:45rem){.review-controls{grid-template-columns:1fr}}
  `],
})
export class BatchScanComponent implements OnInit, OnDestroy {
  active: BatchScanJobDto | null = null;
  items: BatchScanItemSummary[] = [];
  selectedItemId: string | null = null;
  selectedDetail: BatchScanItemDetail | null = null;
  selectedFiles: File[] = [];
  starting = false;
  loading = true;
  error = '';
  actionError = '';
  readonly batchId: string | null;
  readonly conditions = ['NM', 'LP', 'MP', 'HP', 'DMG'];
  selectedItemIds = new Set<string>();
  statusFilter = 'all';
  defaultCondition = 'NM';
  defaultQuantity = 1;
  defaultPurchasePrice: number | null = null;
  defaultStorageLocation = '';
  defaultNotes = '';
  catalogQuery = '';
  catalogResults: Array<{id:string;number:string;name:string;cardLanguage:string}> = [];
  private pollInterval?: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) { this.batchId = this.route.snapshot.paramMap.get('batchId'); }

  ngOnInit() { if (this.batchId) void this.loadBatch(); else void this.loadActive(); }

  ngOnDestroy() { this.clearPoll(); }

  private clearPoll() {
    if (this.pollInterval) { clearInterval(this.pollInterval); this.pollInterval = undefined; }
  }

  async loadActive() {
    this.loading = true;
    this.error = '';
    try {
      const response = await firstValueFrom(this.http.get<{ batch: BatchScanJobDto; items: BatchScanItemSummary[] }>('/api/batch-scans/active'));
      this.active = response?.batch ?? null;
      this.items = response?.items ?? [];
      this.selectedItemIds = new Set(this.items.filter(item => item.matchStatus === 'Matched' || item.matchStatus === 'Overridden').map(item => item.id));
      if (this.active && this.isProcessing(this.active.status)) this.startPoll();
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.active = null;
        this.items = [];
      } else {
        this.error = 'Could not load batch scans.';
      }
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async loadBatch() {
    if (!this.batchId) return;
    this.loading = true; this.error = '';
    try {
      const params = new HttpParams().set('statusFilter', this.statusFilter);
      const response = await firstValueFrom(this.http.get<{ batch: BatchScanJobDto; items: BatchScanItemSummary[] }>(`/api/batch-scans/${this.batchId}`, { params }));
      this.active = response.batch; this.items = response.items;
      this.selectedItemIds = new Set(this.items.filter(item => item.matchStatus === 'Matched' || item.matchStatus === 'Overridden').map(item => item.id));
      if (this.isProcessing(this.active.status)) this.startPoll();
    } catch (error: unknown) { this.error = userSafeErrorMessage(error, undefined, 'Could not load batch.'); }
    finally { this.loading = false; this.cdr.markForCheck(); }
  }

  startPoll() {
    this.clearPoll();
    this.pollInterval = setInterval(async () => {
      try {
        const url = this.batchId ? `/api/batch-scans/${this.batchId}` : '/api/batch-scans/active';
        const response = await firstValueFrom(this.http.get<{ batch: BatchScanJobDto; items: BatchScanItemSummary[] }>(url));
        this.active = response?.batch ?? null;
        this.items = response?.items ?? [];
        if (!this.active || !this.isProcessing(this.active.status)) this.clearPoll();
        this.cdr.markForCheck();
      } catch (error: unknown) {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.active = null;
          this.items = [];
        }
        this.clearPoll();
      }
    }, 3000);
  }

  async selectItem(itemId: string) {
    if (!this.active) return;
    this.selectedItemId = itemId;
    try {
      this.selectedDetail = await firstValueFrom(this.http.get<BatchScanItemDetail>(`/api/batch-scans/${this.active.id}/items/${itemId}`));
    } catch {
      this.selectedDetail = null;
    }
  }

  async matchItem(itemId: string, cardPrintId: string) {
    if (!this.active) return;
    try {
      await firstValueFrom(this.http.put(`/api/batch-scans/${this.active.id}/items/${itemId}/match`, { cardPrintId }));
      await this.loadActive();
      this.selectedDetail = null;
    } catch (error: unknown) { this.actionError = userSafeErrorMessage(error, undefined, 'Could not update match.'); }
  }

  async noMatch(itemId: string) {
    if (!this.active) return;
    try {
      await firstValueFrom(this.http.put(`/api/batch-scans/${this.active.id}/items/${itemId}/no-match`, {}));
      await this.loadActive();
      this.selectedDetail = null;
    } catch (error: unknown) { this.actionError = userSafeErrorMessage(error, undefined, 'Could not mark item.'); }
  }

  async rejectItem(itemId: string) { if (!this.active) return; try { await firstValueFrom(this.http.put(`/api/batch-scans/${this.active.id}/items/${itemId}/reject`, {})); await this.loadCurrent(); this.selectedDetail=null; } catch(error:unknown){this.actionError=userSafeErrorMessage(error, undefined,'Could not reject item.');} }

  async searchCatalog(){if(this.catalogQuery.trim().length<2){this.catalogResults=[];return;}try{const params=new HttpParams().set('q',this.catalogQuery.trim()).set('page',1);this.catalogResults=await firstValueFrom(this.http.get<typeof this.catalogResults>('/api/catalog/cards',{params}));}catch(error:unknown){this.actionError=userSafeErrorMessage(error, undefined,'Catalog search failed.');}finally{this.cdr.markForCheck();}}

  toggleSelected(id:string){const selected=new Set(this.selectedItemIds);selected.has(id)?selected.delete(id):selected.add(id);this.selectedItemIds=selected;}

  async acceptAll() {
    if (!this.active) return;
    const items = this.items
      .filter(item => this.selectedItemIds.has(item.id) && (item.matchStatus === 'Matched' || item.matchStatus === 'Overridden'))
      .map(item => ({ itemId: item.id, condition: this.defaultCondition, quantity: this.defaultQuantity, purchasePrice:this.defaultPurchasePrice, storageLocation:this.defaultStorageLocation||null, notes:this.defaultNotes||null, duplicateAction: 'merge' }));
    try {
      await firstValueFrom(this.http.post(`/api/batch-scans/${this.active.id}/accept`, {
        defaults: { condition: this.defaultCondition, quantity: this.defaultQuantity, purchasePrice:this.defaultPurchasePrice, storageLocation:this.defaultStorageLocation||null, notes:this.defaultNotes||null },
        items,
      }));
      await this.loadActive();
    } catch (error: unknown) { this.actionError = userSafeErrorMessage(error, undefined, 'Could not accept selected items.'); }
  }

  async discardBatch(){if(!this.active)return;try{await firstValueFrom(this.http.delete(`/api/batch-scans/${this.active.id}`));this.active=null;this.items=[];await this.router.navigate(['/batch-scan']);}catch(error:unknown){this.actionError=userSafeErrorMessage(error, undefined,'Could not discard batch.');}}

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.selectedFiles = Array.from(input.files);
  }

  async startBatch() {
    this.starting = true;
    try {
      const form = new FormData();
      this.selectedFiles.forEach(f => form.append('images', f));
      const response = await firstValueFrom(this.http.post<{id:string}>('/api/batch-scans', form));
      await this.router.navigate(['/batch-scan', response.id]);
      this.selectedFiles = [];
    } catch (error: unknown) { this.actionError = userSafeErrorMessage(error, undefined, 'Could not start batch.'); } finally {
      this.starting = false;
      this.cdr.markForCheck();
    }
  }

  hasAcceptableItems(): boolean {
    return this.items.some(item => item.matchStatus === 'Matched' || item.matchStatus === 'Overridden');
  }

  private isProcessing(status: string): boolean {
    return status === 'Uploading' || status === 'Processing';
  }
  private loadCurrent():Promise<void>{return this.batchId?this.loadBatch():this.loadActive();}
}
