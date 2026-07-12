import { DOCUMENT } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

export const antiforgeryInterceptor: HttpInterceptorFn = (request, next) => {
  if (safeMethods.has(request.method.toUpperCase()) || !request.url.startsWith('/api/')) {
    return next(request);
  }

  const cookie = inject(DOCUMENT).cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('XSRF-TOKEN='));
  const token = cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : null;

  return next(token ? request.clone({ setHeaders: { 'X-XSRF-TOKEN': token } }) : request);
};
