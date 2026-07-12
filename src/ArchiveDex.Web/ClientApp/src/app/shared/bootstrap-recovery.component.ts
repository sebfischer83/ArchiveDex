import { Component } from '@angular/core';
import { BootService } from '../core/boot.service';
import { TranslatePipe } from '../core/translate.pipe';
import { TranslateService } from '../core/translate.service';
import { SessionServiceImpl } from '../core/session.service.impl';

@Component({
  selector: 'app-bootstrap-recovery',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="boot-recovery" role="alert">
      <h2>ArchiveDex</h2>
      <p class="boot-message">Application could not start.</p>
      @if (boot.error()?.message) {
        <p class="boot-detail">{{ boot.error()?.message }}</p>
      }
      <button type="button" class="retry-button" (click)="retry()">
        {{ 'actions.retry' | translate }}
      </button>
    </div>
  `,
  styles: [`
    .boot-recovery {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      text-align: center;
      gap: 1rem;
    }
    h2 { font-size: 1.5rem; margin: 0; }
    .boot-message { color: var(--tui-text-negative); font-weight: 500; }
    .boot-detail { color: var(--tui-text-secondary); font-size: 0.875rem; max-width: 28rem; word-break: break-word; }
    .retry-button {
      min-height: 2.75rem;
      padding: 0 2rem;
      background: var(--tui-primary);
      color: var(--tui-primary-text);
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
    }
    .retry-button:hover { opacity: 0.9; }
  `],
})
export class BootstrapRecoveryComponent {
  constructor(
    public readonly boot: BootService,
    private readonly translations: TranslateService,
    private readonly session: SessionServiceImpl,
  ) {}

  retry(): void {
    void this.boot.retry(
      () => this.translations.initialize(),
      () => this.session.load(),
    );
  }
}
