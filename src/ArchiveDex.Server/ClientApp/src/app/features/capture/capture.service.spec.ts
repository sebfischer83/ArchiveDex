import { describe, expect, it } from 'vitest';
import { isActiveCaptureStatus } from './capture.models';

describe('capture status', () => {
  it('continues polling only while analysis is active', () => {
    expect(isActiveCaptureStatus('uploaded')).toBe(true);
    expect(isActiveCaptureStatus('analyzing')).toBe(true);
    expect(isActiveCaptureStatus('needsReview')).toBe(false);
    expect(isActiveCaptureStatus('needsNewImage')).toBe(false);
    expect(isActiveCaptureStatus('failed')).toBe(false);
  });
});
