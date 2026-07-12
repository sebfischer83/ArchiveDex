import { HttpErrorResponse } from '@angular/common/http';
import {
  extractApiError,
  userSafeErrorMessage,
  errorIsDuplicate,
} from './api-error-mapper';

describe('extractApiError', () => {
  it('extracts user-safe message from detail field', () => {
    const err = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { detail: 'Source is required.' },
    });
    expect(extractApiError(err).message).toBe('Source is required.');
  });

  it('extracts user-safe message from message field', () => {
    const err = new HttpErrorResponse({
      status: 500,
      statusText: 'Error',
      error: { message: 'Something went wrong.' },
    });
    expect(extractApiError(err).message).toBe('Something went wrong.');
  });

  it('prefers message over detail', () => {
    const err = new HttpErrorResponse({
      status: 400,
      statusText: 'Error',
      error: { message: 'Msg', detail: 'Detail' },
    });
    expect(extractApiError(err).message).toBe('Msg');
  });

  it('detects 404 not found', () => {
    const err = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: {} });
    const result = extractApiError(err);
    expect(result.isNotFound).toBeTrue();
  });

  it('detects no-active sentinel for 404 with not_found error code', () => {
    const err = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: { error: 'not_found' },
    });
    const result = extractApiError(err);
    expect(result.isNoActive).toBeTrue();
  });

  it('detects validation errors', () => {
    const err = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { errors: { quantity: ['Must be at least 1.'] } },
    });
    const result = extractApiError(err);
    expect(result.isValidationError).toBeTrue();
    expect(result.validationErrors).toEqual({ quantity: ['Must be at least 1.'] });
  });

  it('compiles validation errors as message fallback', () => {
    const err = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { errors: { quantity: ['Min 1.'], cardId: ['Required.'] } },
    });
    expect(extractApiError(err).message).toBe('Min 1. Required.');
  });

  it('detects network errors', () => {
    const networkErr = new TypeError('Network Error');
    expect(extractApiError(networkErr).isNetworkError).toBeTrue();
  });

  it('provides default messages for HTTP status codes', () => {
    expect(extractApiError(new HttpErrorResponse({ status: 401, statusText: '', error: {} })).message)
      .toContain('Session expired');
    expect(extractApiError(new HttpErrorResponse({ status: 403, statusText: '', error: {} })).message)
      .toContain('permission');
    expect(extractApiError(new HttpErrorResponse({ status: 500, statusText: '', error: {} })).message)
      .toContain('server error');
  });

  it('does not treat authentication 404 as data-not-found', () => {
    const err = new HttpErrorResponse({ status: 404, statusText: '', error: {} });
    const result = extractApiError(err);
    expect(result.isNotFound).toBeTrue();
    expect(result.message).toContain('not found');
  });

  it('extracts stable error code', () => {
    const err = new HttpErrorResponse({
      status: 400,
      statusText: '',
      error: { code: 'DUPLICATE_SET', message: 'Set already exists.' },
    });
    expect(extractApiError(err).code).toBe('DUPLICATE_SET');
  });
});

describe('userSafeErrorMessage', () => {
  it('returns the extracted message', () => {
    const err = new HttpErrorResponse({
      status: 400,
      statusText: '',
      error: { message: 'Invalid input.' },
    });
    expect(userSafeErrorMessage(err)).toBe('Invalid input.');
  });

  it('returns fallback when no message available', () => {
    const err = new HttpErrorResponse({ status: 418, statusText: '', error: {} });
    expect(userSafeErrorMessage(err, undefined, 'Custom fallback.')).toBe('Custom fallback.');
  });

  it('returns network error message', () => {
    expect(userSafeErrorMessage(new TypeError('Network Error'))).toContain('connection');
  });
});

describe('errorIsDuplicate', () => {
  it('returns true for 409 responses', () => {
    expect(errorIsDuplicate(new HttpErrorResponse({ status: 409, statusText: 'Conflict', error: {} }))).toBeTrue();
  });

  it('returns false for non-409 responses', () => {
    expect(errorIsDuplicate(new HttpErrorResponse({ status: 400, statusText: '', error: {} }))).toBeFalse();
  });
});
