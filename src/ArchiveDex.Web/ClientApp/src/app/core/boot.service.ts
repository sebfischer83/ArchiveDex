import { Injectable, signal } from '@angular/core';

export interface BootError {
  type: 'localization' | 'session' | 'both';
  message: string;
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
      const message = err instanceof Error ? err.message : String(err);
      this.setError({ type: 'both', message });
    }
  }
}
