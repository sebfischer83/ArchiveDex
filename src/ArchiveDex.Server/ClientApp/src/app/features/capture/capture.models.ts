export type CaptureStatus = 'uploaded' | 'analyzing' | 'needsReview' | 'needsNewImage' | 'failed';

export function isActiveCaptureStatus(status: CaptureStatus): boolean {
  return status === 'uploaded' || status === 'analyzing';
}

export interface BatchCounts {
  uploaded: number;
  analyzing: number;
  needsReview: number;
  needsNewImage: number;
  failed: number;
}

export interface BatchItem {
  captureId: string;
  status: CaptureStatus;
  thumbnailUrl: string;
  /** A deskewed cut-out was detected for this capture and can be stored instead of the photo. */
  hasCrop: boolean;
  etag: string;
  name: string | null;
  printedNumber: string | null;
  setName: string | null;
  condition: string | null;
  valuationAmountMinor: number | null;
  error: { code: string; detail: string; retryable: boolean } | null;
}

export interface BatchSummary {
  batchId: string;
  total: number;
  finalized: number;
  counts: BatchCounts;
  items: BatchItem[];
}

/** True once nothing is still uploading or being analysed (all items are user-actionable). */
export function isBatchSettled(summary: BatchSummary): boolean {
  return summary.counts.uploaded === 0 && summary.counts.analyzing === 0;
}
