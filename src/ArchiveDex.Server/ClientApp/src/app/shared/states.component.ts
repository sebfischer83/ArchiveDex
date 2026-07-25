import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TuiLoader, TuiButton, TuiIcon, TuiTitle, TuiNotificationDirective } from '@taiga-ui/core';
import { TranslatePipe } from '../core/translate.service';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [TuiLoader],
  template: `<div class="state"><tui-loader size="l" [inheritColor]="false" /></div>`,
  styles: [`.state{display:flex;justify-content:center;padding:3rem}`],
})
export class LoadingStateComponent {}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [TuiIcon, TuiTitle],
  template: `
    <div class="state">
      <tui-icon icon="@tui.inbox" />
      <span tuiTitle><span tuiSubtitle>{{ message }}</span></span>
    </div>
  `,
  styles: [`.state{display:flex;flex-direction:column;align-items:center;gap:.75rem;padding:3rem;color:var(--tui-text-tertiary);text-align:center}.state tui-icon{font-size:2rem}`],
})
export class EmptyStateComponent { @Input() message = ''; }

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [TuiButton, TuiTitle, TuiNotificationDirective, TranslatePipe],
  template: `
    <div tuiNotification appearance="negative" role="alert">
      <span tuiTitle>{{ message }}</span>
      <button tuiButton type="button" appearance="outline" size="s" (click)="retry.emit()">{{ 'actions.retry' | translate }}</button>
    </div>
  `,
  styles: [`:host{display:block}`],
})
export class ErrorStateComponent { @Input() message = ''; @Output() retry = new EventEmitter<void>(); }
