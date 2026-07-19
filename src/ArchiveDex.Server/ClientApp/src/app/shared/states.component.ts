import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslatePipe } from '../core/translate.service';

@Component({ selector: 'app-loading-state', standalone: true, imports: [TranslatePipe], template: `<div class="state"><p>{{ 'states.loading' | translate }}</p></div>`, styles: [`.state{text-align:center;padding:2rem;color:#888}`] })
export class LoadingStateComponent {}

@Component({ selector: 'app-empty-state', standalone: true, template: `<div class="state"><p>{{ message }}</p></div>`, styles: [`.state{text-align:center;padding:2rem;color:#888}`] })
export class EmptyStateComponent { @Input() message = ''; }

@Component({ selector: 'app-error-state', standalone: true, imports: [TranslatePipe], template: `<div class="state" role="alert"><p>{{ message }}</p><button (click)="retry.emit()">{{ 'actions.retry' | translate }}</button></div>`, styles: [`.state{text-align:center;padding:2rem;color:#c00}`] })
export class ErrorStateComponent { @Input() message = ''; @Output() retry = new EventEmitter<void>(); }
