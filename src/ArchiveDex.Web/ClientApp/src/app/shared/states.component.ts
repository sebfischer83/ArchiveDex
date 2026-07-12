import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiLoader } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../core/translate.pipe';

@Component({
  selector: 'app-loading-state',
  template: `<div class="state-container" role="status" aria-live="polite"><tui-loader size="l" [showLoader]="true" [textContent]="message() || ('states.loading' | translate)"></tui-loader></div>`,
  standalone: true,
  imports: [TuiLoader, CommonModule, TranslatePipe],
  styles: [`.state-container { display: flex; justify-content: center; align-items: center; padding: 4rem 0; }`],
})
export class LoadingStateComponent { readonly message = input<string>(); }

@Component({
  selector: 'app-empty-state',
  template: `<div class="state-container empty"><p>{{ message() || ('states.empty' | translate) }}</p></div>`,
  standalone: true,
  imports: [TranslatePipe],
  styles: [`.state-container { text-align: center; padding: 4rem 0; color: var(--tui-text-secondary); }`],
})
export class EmptyStateComponent { readonly message = input<string>(); }

@Component({
  selector: 'app-error-state',
  template: `<div class="state-container error" role="alert"><p class="error-message">{{ message() || ('states.error' | translate) }}</p><button type="button" (click)="onRetry()">{{ 'actions.retry' | translate }}</button></div>`,
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  styles: [`.state-container { text-align: center; padding: 4rem 0; } .error-message { color: var(--tui-text-negative); }`],
})
export class ErrorStateComponent {
  readonly message = input<string>();
  readonly retry = output<void>();
  onRetry() { this.retry.emit(); }
}

@Component({
  selector: 'app-access-denied',
  template: `<div class="state-container"><h2>{{ 'states.accessDenied' | translate }}</h2><p>{{ 'states.accessDeniedDetail' | translate }}</p></div>`,
  standalone: true,
  imports: [TranslatePipe],
  styles: [`.state-container { text-align: center; padding: 4rem 0; }`],
})
export class AccessDeniedComponent {}

@Component({
  selector: 'app-not-found',
  template: `<div class="state-container"><h2>{{ 'states.notFound' | translate }}</h2><p>{{ 'states.notFoundDetail' | translate }}</p><a routerLink="/" style="color:var(--tui-link)">{{ 'states.returnHome' | translate }}</a></div>`,
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  styles: [`.state-container { text-align: center; padding: 4rem 0; }`],
})
export class NotFoundComponent {}
