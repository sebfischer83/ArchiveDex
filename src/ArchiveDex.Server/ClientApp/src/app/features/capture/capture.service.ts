import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, firstValueFrom, switchMap, takeWhile, timer } from 'rxjs';
import { CaptureStatus, isActiveCaptureStatus } from './capture.models';
export { CaptureStatus, isActiveCaptureStatus } from './capture.models';

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
  valuation: { status: string; amountMinor: number | null; currency: string | null; disclaimer: string } | null;
  candidates: CatalogCandidate[];
}
export interface Capture {
  id: string; status: CaptureStatus; proposal: AnalysisProposal | null;
  duplicate: { matchingSpecimenId: string; exactMatch: boolean } | null;
  error: { code: string; detail: string; retryable: boolean } | null;
  createdAt: string; updatedAt: string; etag: string;
}
export interface ReviewCapture {
  catalogReferenceId: string | null; originalName: string; germanName: string | null;
  germanNameUnavailableReason: string | null; printedNumber: string; setIdentifier: string;
  setName: string; language: string; variantKey: string; condition: string;
}
export interface FinalizedSpecimen { id: string; cardRecordId: string; }

@Injectable({ providedIn: 'root' })
export class CaptureService {
  private readonly finalizationKeys = new Map<string, string>();
  constructor(private readonly http: HttpClient) {}

  create(file: File): Promise<Capture> {
    const form = new FormData();
    form.append('image', file);
    return firstValueFrom(this.http.post<Capture>('/api/v1/captures', form, {
      headers: new HttpHeaders({ 'Idempotency-Key': crypto.randomUUID() }),
    }));
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
      }));
  }

  retry(capture: Capture): Promise<Capture> {
    return firstValueFrom(this.http.post<Capture>(`/api/v1/captures/${capture.id}/retry`, {}, {
      headers: new HttpHeaders({
        'If-Match': capture.etag,
        'Idempotency-Key': crypto.randomUUID(),
      }),
    }));
  }
}
