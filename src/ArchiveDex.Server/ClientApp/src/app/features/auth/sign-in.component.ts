import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiTextfield, TuiInputDirective, TuiTitle, TuiNotificationDirective } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { SessionService } from '../../core/session.service';
import { TranslatePipe } from '../../core/translate.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TuiButton, TuiTextfield, TuiInputDirective, TuiTitle, TuiNotificationDirective, TuiCardLarge],
  template: `
    <div tuiCardLarge class="sign-in">
      <h2 tuiTitle>{{ 'auth.signIn' | translate }}</h2>
      <form (ngSubmit)="doSignIn()">
        <tui-textfield>
          <label tuiLabel>{{ 'auth.username' | translate }}</label>
          <input tuiInput [(ngModel)]="userName" name="user" required />
        </tui-textfield>
        <tui-textfield>
          <label tuiLabel>{{ 'auth.password' | translate }}</label>
          <input tuiInput type="password" [(ngModel)]="password" name="pass" required />
        </tui-textfield>
        <button tuiButton type="submit" appearance="primary" [disabled]="loading()">{{ 'auth.signIn' | translate }}</button>
      </form>
      @if (error()) {
        <div tuiNotification appearance="negative" role="alert">
          <span tuiTitle>{{ error() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`.sign-in{max-width:24rem;margin:2rem auto;display:flex;flex-direction:column;gap:1rem}form{display:flex;flex-direction:column;gap:1rem}`],
})
export class SignInComponent {
  userName = ''; password = '';
  readonly loading = signal(false); readonly error = signal('');
  constructor(private session: SessionService, private router: Router) {}
  async doSignIn() {
    this.loading.set(true); this.error.set('');
    try { await this.session.signIn(this.userName, this.password); await this.router.navigate(['/capture']); }
    catch { this.error.set('Invalid credentials.'); }
    finally { this.loading.set(false); }
  }
}
