import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TuiButton, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TranslatePipe } from '../../core/translate.pipe';
import { TranslateService } from '../../core/translate.service';

interface AccountDto {
  username: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, TuiButton, TuiLabel, TuiTextfield, TranslatePipe],
  template: `
    <section class="account-card">
      <h2>{{ 'account.title' | translate }}</h2>
      @if (loading) {
        <p role="status">{{ 'states.loading' | translate }}</p>
      } @else if (loadError) {
        <p role="alert" class="error">{{ loadError }}</p>
        <button tuiButton type="button" appearance="secondary" (click)="load()">{{ 'actions.retry' | translate }}</button>
      } @else {
        <dl>
          <dt>{{ 'auth.username' | translate }}</dt>
          <dd>{{ username }}</dd>
        </dl>
        <form (ngSubmit)="updatePassword()">
          <tui-textfield>
            <label tuiLabel>{{ 'account.newPassword' | translate }}</label>
            <input tuiTextfield type="password" [(ngModel)]="newPassword" name="newPassword" minlength="8" required autocomplete="new-password" />
          </tui-textfield>
          <button tuiButton type="submit" appearance="primary" [disabled]="saving">
            {{ (saving ? 'account.saving' : 'account.updatePassword') | translate }}
          </button>
        </form>
        @if (message) { <p role="status" class="success">{{ message }}</p> }
        @if (saveError) { <p role="alert" class="error">{{ saveError }}</p> }
      }
    </section>
  `,
  styles: [`
    .account-card { max-width: 32rem; }
    dl { display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem; }
    dt { color: var(--tui-text-secondary); }
    dd { margin: 0; }
    form { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
    .error { color: var(--tui-text-negative); }
    .success { color: var(--tui-text-positive); }
  `],
})
export class AccountComponent implements OnInit {
  username = '';
  newPassword = '';
  loading = true;
  saving = false;
  loadError = '';
  saveError = '';
  message = '';

  constructor(
    private http: HttpClient,
    private translations: TranslateService,
  ) {}

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading = true;
    this.loadError = '';
    try {
      const account = await firstValueFrom(this.http.get<AccountDto>('/api/account'));
      this.username = account.username;
    } catch {
      this.loadError = this.translations.translate('account.loadError');
    } finally {
      this.loading = false;
    }
  }

  async updatePassword(): Promise<void> {
    this.saving = true;
    this.saveError = '';
    this.message = '';
    try {
      await firstValueFrom(this.http.put('/api/account', { newPassword: this.newPassword }));
      this.newPassword = '';
      this.message = this.translations.translate('account.updated');
    } catch {
      this.saveError = this.translations.translate('account.updateError');
    } finally {
      this.saving = false;
    }
  }
}
