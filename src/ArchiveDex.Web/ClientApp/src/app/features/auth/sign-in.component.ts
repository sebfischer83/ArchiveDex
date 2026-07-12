import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionServiceImpl } from '../../core/session.service.impl';
import { TuiTextfield, TuiButton, TuiLabel } from '@taiga-ui/core';
import { TranslatePipe } from '../../core/translate.pipe';
import { TranslateService } from '../../core/translate.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, TuiTextfield, TuiButton, TuiLabel, TranslatePipe, CommonModule],
  template: `
    <div style="max-width:400px;margin:4rem auto;padding:2rem">
      <h2>{{ 'auth.signIn' | translate }}</h2>
      <form (ngSubmit)="submit()" style="display:flex;flex-direction:column;gap:1rem">
        <tui-textfield>
          <label tuiLabel>{{ 'auth.username' | translate }}</label>
          <input tuiTextfield type="text" [(ngModel)]="username" name="username" required />
        </tui-textfield>
        <tui-textfield>
          <label tuiLabel>{{ 'auth.password' | translate }}</label>
          <input tuiTextfield type="password" [(ngModel)]="password" name="password" required />
        </tui-textfield>
        <button tuiButton type="submit" appearance="primary" size="m" [disabled]="submitting">{{ 'auth.signIn' | translate }}</button>
        <p *ngIf="error" role="alert" style="color:var(--tui-text-negative)">{{ error }}</p>
      </form>
    </div>
  `,
})
export class SignInComponent {
  username = '';
  password = '';
  error = '';
  submitting = false;

  constructor(
    private session: SessionServiceImpl,
    private router: Router,
    private route: ActivatedRoute,
    private translations: TranslateService,
  ) {}

  async submit() {
    this.submitting = true;
    this.error = '';
    try {
      await this.session.signIn(this.username, this.password);
      if (this.session.state.setupRequired) {
        await this.router.navigate(['/setup']);
      } else {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        await this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/catalog');
      }
    } catch {
      this.error = this.translations.translate('auth.invalidCredentials');
    } finally {
      this.submitting = false;
    }
  }
}
