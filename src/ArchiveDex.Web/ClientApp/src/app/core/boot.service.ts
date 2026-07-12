import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface BootError {
  type: 'localization' | 'session' | 'both';
  message: string;
}

// HttpErrorResponse implements Error but does not extend it, so String(err) yields "[object Object]".
export function describeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    return `${err.status} ${err.statusText} - ${err.url ?? ''}`.trim();
  }
  return err instanceof Error ? err.message : String(err);
}

@Injectable({ providedIn: 'root' })
export class BootService {
  readonly error = signal<BootError | null>(null);
  readonly ready = signal(false);

  setError(error: BootError): void {
    this.error.set(error);
  }

  markReady(): void {
    this.ready.set(true);
  }

  async retry(
    translationInit: () => Promise<void>,
    sessionLoad: () => Promise<void>,
  ): Promise<void> {
    this.error.set(null);
    try {
      await Promise.all([translationInit(), sessionLoad()]);
      this.markReady();
    } catch (err: unknown) {
      this.setError({ type: 'both', message: describeError(err) });
    }
  }
}
