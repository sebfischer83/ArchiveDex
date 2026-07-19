export type CaptureStatus = 'uploaded' | 'analyzing' | 'needsReview' | 'needsNewImage' | 'failed';

export function isActiveCaptureStatus(status: CaptureStatus): boolean {
  return status === 'uploaded' || status === 'analyzing';
}
