import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from './translate.service';

export interface ApiError {
  message: string;
  code: string | null;
  isNotFound: boolean;
  isNoActive: boolean;
  isValidationError: boolean;
  isNetworkError: boolean;
  validationErrors: Record<string, string[]>;
}

export function extractApiError(error: unknown): ApiError {
  const isNetworkError = error instanceof TypeError && error.message === 'Network Error';

  if (!(error instanceof HttpErrorResponse)) {
    return {
      message: 'A network error occurred.',
      code: null,
      isNotFound: false,
      isNoActive: false,
      isValidationError: false,
      isNetworkError,
      validationErrors: {},
    };
  }

  const body = error.error;
  const isNotFound = error.status === 404;
  const isNoActive = isNotFound && body?.error === 'not_found';
  const isValidationError = error.status === 400;
  const validationErrors: Record<string, string[]> =
    typeof body?.errors === 'object' && body?.errors !== null
      ? body.errors
      : {};

  const message =
    body?.message ??
    body?.detail ??
    compileValidationErrors(validationErrors) ??
    defaultMessage(error.status);

  return {
    message,
    code: body?.code ?? null,
    isNotFound,
    isNoActive,
    isValidationError,
    isNetworkError,
    validationErrors,
  };
}

export function userSafeErrorMessage(
  error: unknown,
  translations?: TranslateService,
  fallback?: string,
): string {
  const api = extractApiError(error);

  if (api.isNetworkError) {
    return translations
      ? translations.translate('states.networkError')
      : 'Network error. Check your connection and try again.';
  }

  if (api.isNotFound && !api.isNoActive) {
    return translations
      ? translations.translate('states.notFound')
      : 'Not found.';
  }

  return api.message || fallback || 'An error occurred.';
}

export function errorIsDuplicate(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 409;
}

function compileValidationErrors(errors: Record<string, string[]>): string | null {
  const texts = Object.values(errors).flat().filter(Boolean);
  return texts.length ? texts.join(' ') : null;
}

function defaultMessage(status: number): string {
  switch (status) {
    case 401: return 'Session expired. Please sign in again.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'A conflicting entry already exists.';
    case 500: return 'An internal server error occurred.';
    default: return 'An unexpected error occurred.';
  }
}
