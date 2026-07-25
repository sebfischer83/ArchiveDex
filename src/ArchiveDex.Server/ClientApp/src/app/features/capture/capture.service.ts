import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, from, map, mergeMap, of, scan, switchMap, takeWhile, timer } from 'rxjs';
import { BatchSummary, CaptureStatus, isActiveCaptureStatus } from './capture.models';
export { CaptureStatus, isActiveCaptureStatus, isBatchSettled } from './capture.models';
export type { BatchSummary, BatchItem, BatchCounts } from './capture.models';

/** How many image uploads run in parallel during a batch upload. */
const UPLOAD_CONCURRENCY = 4;

export interface BatchCreated { batchId: string; }
export interface BatchUploadResult { id: string; status: CaptureStatus; thumbnailUrl: string; }
export interface BatchUploadProgress { done: number; total: number; failures: { name: string; reason: string }[]; }

export interface ProposedText { value: string | null; confidence: 'high' | 'medium' | 'low'; reason: string | null; }
export interface CatalogCandidate {
  catalogReferenceId: string; printedName: string; officialGermanName: string | null;
  printedNumber: string; setIdentifier: string; setName: string; language: string;
  variantKey: string; confidence: 'high' | 'medium' | 'low';
}
export interface AnalysisProposal {
  printedName: ProposedText; officialGermanName: ProposedText; printedNumber: ProposedText;
  setIdentifier: ProposedText; setName: ProposedText; language: ProposedText; variantKey: ProposedText;
  condition: { grade: string | null; confidence: string; observedDefects: string[]; limitations: string[] };
  valuation: {
    status: string; amountMinor: number | null; currency: string | null; disclaimer: string;
    provider: string | null; method: string | null; marketDataAsOf: string | null; sourceUrls: string[];
  } | null;
  aiCost: {
    provider: string; model: string; inputTokens: number; outputTokens: number; webSearchCalls: number;
    estimatedAmount: number | null; currency: string; isBatch: boolean; pricingAsOf: string;
  } | null;
  candidates: CatalogCandidate[];
}
export interface Capture {
  id: string; status: CaptureStatus; imageUrl: string; thumbnailUrl: string;
  proposal: AnalysisProposal | null;
  duplicate: { matchingSpecimenId: string; exactMatch: boolean } | null;
  error: { code: string; detail: string; retryable: boolean } | null;
  createdAt: string; updatedAt: string; etag: string;
}
export interface ReviewCapture {
  catalogReferenceId: string | null; originalName: string; germanName: string | null;
  germanNameUnavailableReason: string | null; printedNumber: string; collectorNumber: string; setTotal: string | null; setIdentifier: string;
  setName: string; language: string; variantKey: string; condition: string;
}
export interface FinalizedSpecimen { id: string; cardRecordId: string; }

@Injectable({ providedIn: 'root' })
export class CaptureService {
  private readonly finalizationKeys = new Map<string, string>();
  private readonly activeCaptureStorageKey = 'archivedex.activeCaptureId';
  private readonly activeBatchStorageKey = 'archivedex.activeBatchId';
  readonly activeCaptureId = signal<string | null>(this.readStored(this.activeCaptureStorageKey));
  readonly activeBatchId = signal<string | null>(this.readStored(this.activeBatchStorageKey));
  constructor(private readonly http: HttpClient) {}

  // --- Batch upload of many images ---

  createBatch(): Promise<string> {
    return firstValueFrom(this.http.post<BatchCreated>('/api/v1/captures/batch', {}))
      .then(response => { this.rememberActiveBatch(response.batchId); return response.batchId; });
  }

  /** Uploads all files with limited concurrency, emitting cumulative progress per file. */
  uploadBatchImages(batchId: string, files: File[]): Observable<BatchUploadProgress> {
    return from(files).pipe(
      mergeMap(file => this.uploadToBatch(batchId, file).pipe(
        map(() => ({ ok: true as const, name: file.name, reason: '' })),
        catchError(() => of({ ok: false as const, name: file.name, reason: `„${file.name}" konnte nicht hochgeladen werden.` })),
      ), UPLOAD_CONCURRENCY),
      scan((acc, result) => ({
        done: acc.done + 1,
        total: files.length,
        failures: result.ok ? acc.failures : [...acc.failures, { name: result.name, reason: result.reason }],
      }), { done: 0, total: files.length, failures: [] } as BatchUploadProgress),
    );
  }

  uploadToBatch(batchId: string, file: File): Observable<BatchUploadResult> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<BatchUploadResult>(`/api/v1/captures/batch/${batchId}/images`, form, {
      headers: new HttpHeaders({ 'Idempotency-Key': crypto.randomUUID() }),
    });
  }

  getBatch(batchId: string): Promise<BatchSummary> {
    return firstValueFrom(this.http.get<BatchSummary>(`/api/v1/captures/batch/${batchId}`));
  }

  pollBatch(batchId: string): Observable<BatchSummary> {
    return timer(0, 2000).pipe(switchMap(() => this.http.get<BatchSummary>(`/api/v1/captures/batch/${batchId}`)));
  }

  deleteBatch(batchId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`/api/v1/captures/batch/${batchId}`))
      .then(() => this.clearActiveBatch(batchId));
  }

  getCapture(id: string): Promise<Capture> {
    return firstValueFrom(this.http.get<Capture>(`/api/v1/captures/${id}`));
  }

  deleteCapture(id: string, etag: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`/api/v1/captures/${id}`, {
      headers: new HttpHeaders({ 'If-Match': etag }),
    }));
  }

  /** One-click accept: confirms the AI proposal unchanged and finalizes the capture. */
  async acceptProposed(id: string, allowDuplicate = false): Promise<HttpResponse<FinalizedSpecimen>> {
    const capture = await this.getCapture(id);
    const reviewed = await this.review(capture, deriveReviewModel(capture));
    return this.finalize(reviewed, allowDuplicate);
  }

  rememberActiveBatch(id: string): void {
    this.activeBatchId.set(id);
    try { globalThis.localStorage?.setItem(this.activeBatchStorageKey, id); }
    catch { /* Storage can be unavailable in restricted browser contexts. */ }
  }

  clearActiveBatch(id?: string): void {
    if (id && this.activeBatchId() !== id) return;
    this.activeBatchId.set(null);
    try { globalThis.localStorage?.removeItem(this.activeBatchStorageKey); }
    catch { /* Storage can be unavailable in restricted browser contexts. */ }
  }

  create(file: File): Promise<Capture> {
    const form = new FormData();
    form.append('image', file);
    return firstValueFrom(this.http.post<Capture>('/api/v1/captures', form, {
      headers: new HttpHeaders({ 'Idempotency-Key': crypto.randomUUID() }),
    })).then(capture => {
      this.rememberActiveCapture(capture.id);
      return capture;
    });
  }

  rememberActiveCapture(id: string): void {
    this.activeCaptureId.set(id);
    try { globalThis.localStorage?.setItem(this.activeCaptureStorageKey, id); }
    catch { /* Storage can be unavailable in restricted browser contexts. */ }
  }

  clearActiveCapture(id?: string): void {
    if (id && this.activeCaptureId() !== id) return;
    this.activeCaptureId.set(null);
    try { globalThis.localStorage?.removeItem(this.activeCaptureStorageKey); }
    catch { /* Storage can be unavailable in restricted browser contexts. */ }
  }

  poll(id: string): Observable<Capture> {
    return timer(0, 1000).pipe(
      switchMap(() => this.http.get<Capture>(`/api/v1/captures/${id}`)),
      takeWhile(capture => isActiveCaptureStatus(capture.status), true),
    );
  }

  review(capture: Capture, request: ReviewCapture): Promise<Capture> {
    return firstValueFrom(this.http.put<Capture>(`/api/v1/captures/${capture.id}/review`, request, {
      headers: new HttpHeaders({ 'If-Match': capture.etag }),
    }));
  }

  finalize(capture: Capture, allowDuplicate: boolean): Promise<HttpResponse<FinalizedSpecimen>> {
    const idempotencyKey = this.finalizationKeys.get(capture.id) ?? crypto.randomUUID();
    this.finalizationKeys.set(capture.id, idempotencyKey);
    return firstValueFrom(this.http.post<FinalizedSpecimen>(`/api/v1/captures/${capture.id}/finalize`,
      { allowDuplicate }, {
        headers: new HttpHeaders({
          'If-Match': capture.etag,
          'Idempotency-Key': idempotencyKey,
        }),
        observe: 'response',
      })).then(response => {
        this.clearActiveCapture(capture.id);
        return response;
      });
  }

  retry(capture: Capture): Promise<Capture> {
    return firstValueFrom(this.http.post<Capture>(`/api/v1/captures/${capture.id}/retry`, {}, {
      headers: new HttpHeaders({
        'If-Match': capture.etag,
        'Idempotency-Key': crypto.randomUUID(),
      }),
    }));
  }

  private readStored(key: string): string | null {
    try { return globalThis.localStorage?.getItem(key) ?? null; }
    catch { return null; }
  }
}

/** Builds a ReviewCapture from a capture's AI proposal (used for populate + one-click accept). */
export function deriveReviewModel(capture: Capture): ReviewCapture {
  const proposal = capture.proposal;
  const candidate = proposal?.candidates[0];
  const printed = candidate?.printedNumber ?? proposal?.printedNumber.value ?? '';
  const slash = printed.indexOf('/');
  const collectorNumber = slash < 0 ? printed.trim() : printed.slice(0, slash).trim();
  const setTotal = slash < 0 ? null : (printed.slice(slash + 1).trim() || null);
  const germanName = candidate?.officialGermanName ?? proposal?.officialGermanName.value ?? null;
  return {
    catalogReferenceId: candidate?.catalogReferenceId ?? null,
    originalName: proposal?.printedName.value?.trim() || candidate?.printedName || '',
    germanName,
    germanNameUnavailableReason: germanName ? null : 'Nicht im Katalog verfügbar',
    printedNumber: printed,
    collectorNumber,
    setTotal,
    setIdentifier: candidate?.setIdentifier ?? proposal?.setIdentifier.value ?? '',
    setName: candidate?.setName ?? proposal?.setName.value ?? '',
    language: candidate?.language ?? proposal?.language.value ?? 'en',
    variantKey: candidate?.variantKey ?? proposal?.variantKey.value ?? 'standard',
    condition: proposal?.condition.grade ?? 'NM',
  };
}
