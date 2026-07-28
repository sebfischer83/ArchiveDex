import '@angular/compiler';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { isActiveCaptureStatus } from './capture.models';
import { Capture, CaptureService, deriveReviewModel, detectSetOverride } from './capture.service';

describe('capture status', () => {
  it('continues polling only while analysis is active', () => {
    expect(isActiveCaptureStatus('uploaded')).toBe(true);
    expect(isActiveCaptureStatus('analyzing')).toBe(true);
    expect(isActiveCaptureStatus('needsReview')).toBe(false);
    expect(isActiveCaptureStatus('needsNewImage')).toBe(false);
    expect(isActiveCaptureStatus('failed')).toBe(false);
  });
});

describe('capture finalization', () => {
  it('allows an identical image to be stored as another specimen', async () => {
    const post = vi.fn().mockReturnValue(of(new HttpResponse({
      status: 201,
      body: { id: 'specimen-2', cardRecordId: 'card-1' },
    })));
    const service = new CaptureService({ post } as unknown as HttpClient);
    const capture = { id: 'capture-2', etag: '"2"' } as Capture;

    await service.finalize(capture);

    expect(post).toHaveBeenCalledWith(
      '/api/v1/captures/capture-2/finalize',
      { allowDuplicate: true },
      expect.objectContaining({ observe: 'response' }),
    );
  });
});

/** Builds a capture whose AI proposal names the wrong set, as happens across a whole shoot. */
function captureProposing(setIdentifier: string, setName: string, language: string): Capture {
  return {
    id: 'capture-1',
    status: 'needsReview',
    proposal: {
      printedName: { value: '暴鲤龙V' },
      officialGermanName: { value: null },
      printedNumber: { value: '019/115' },
      setIdentifier: { value: setIdentifier },
      setName: { value: setName },
      language: { value: language },
      variantKey: { value: 'holo' },
      condition: { grade: 'NM' },
      candidates: [],
    },
  } as unknown as Capture;
}

describe('batch set correction', () => {
  it('keeps the proposed set when no override is given', () => {
    const model = deriveReviewModel(captureProposing('CS2b', 'Wrong Set', 'en'));

    expect(model.setIdentifier).toBe('CS2b');
    expect(model.setName).toBe('Wrong Set');
    expect(model.language).toBe('en');
  });

  it('replaces the proposed set with the override but leaves the card fields alone', () => {
    const capture = captureProposing('CS2b', 'Wrong Set', 'en');

    const model = deriveReviewModel(capture, {
      setIdentifier: 'CS2bC', setName: 'Vivid Portrayals - Indigo', language: 'zh-cn',
    });

    expect(model.setIdentifier).toBe('CS2bC');
    expect(model.setName).toBe('Vivid Portrayals - Indigo');
    expect(model.language).toBe('zh-cn');
    // The correction is about the set only; per-card data must survive untouched.
    expect(model.originalName).toBe('暴鲤龙V');
    expect(model.collectorNumber).toBe('019');
    expect(model.setTotal).toBe('115');
    expect(model.variantKey).toBe('holo');
  });

  it('detects a set the reviewer changed', () => {
    const capture = captureProposing('CS2b', 'Wrong Set', 'en');
    const reviewed = deriveReviewModel(capture);
    reviewed.setIdentifier = 'CS2bC';
    reviewed.setName = 'Vivid Portrayals - Indigo';
    reviewed.language = 'zh-cn';

    expect(detectSetOverride(capture, reviewed)).toEqual({
      setIdentifier: 'CS2bC', setName: 'Vivid Portrayals - Indigo', language: 'zh-cn',
    });
  });

  it('reports no correction when only card fields were edited', () => {
    const capture = captureProposing('CS2bC', 'Vivid Portrayals - Indigo', 'zh-cn');
    const reviewed = deriveReviewModel(capture);
    reviewed.originalName = 'Corrected name';
    reviewed.condition = 'LP';

    expect(detectSetOverride(capture, reviewed)).toBeNull();
  });

  it('carries the override into a one-click accept', async () => {
    const capture = captureProposing('CS2b', 'Wrong Set', 'en');
    const get = vi.fn().mockReturnValue(of(capture));
    const put = vi.fn().mockReturnValue(of(capture));
    const post = vi.fn().mockReturnValue(of(new HttpResponse({ status: 201, body: { id: 's1' } })));
    const service = new CaptureService({ get, put, post } as unknown as HttpClient);

    await service.acceptProposed('capture-1', {
      setIdentifier: 'CS2bC', setName: 'Vivid Portrayals - Indigo', language: 'zh-cn',
    });

    expect(put).toHaveBeenCalledWith(
      '/api/v1/captures/capture-1/review',
      expect.objectContaining({ setIdentifier: 'CS2bC', setName: 'Vivid Portrayals - Indigo', language: 'zh-cn' }),
      expect.anything(),
    );
  });
});
