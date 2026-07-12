import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SessionServiceImpl } from '../../core/session.service.impl';
import { TuiButton } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TranslatePipe } from '../../core/translate.pipe';
import { TranslateService } from '../../core/translate.service';

interface SetupValidation {
  databaseReachable: boolean;
  storageWritable: boolean;
  messages: string[];
}

interface SetupState {
  isSetupComplete: boolean;
}

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [TuiButton, TuiLabel, TuiTextfield, CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="setup-card">
      <h2>{{ 'setup.title' | translate }}</h2>
      <p>{{ 'setup.description' | translate }}</p>
      <form (ngSubmit)="runSetup()">
        <tui-textfield>
          <label tuiLabel>{{ 'auth.username' | translate }}</label>
          <input tuiTextfield [(ngModel)]="adminUserName" name="adminUserName" required autocomplete="username" />
        </tui-textfield>
        <tui-textfield>
          <label tuiLabel>{{ 'setup.adminPassword' | translate }}</label>
          <input tuiTextfield [(ngModel)]="adminPassword" name="adminPassword" type="password" minlength="8" required autocomplete="new-password" />
        </tui-textfield>
        <label>
          {{ 'setup.currency' | translate }}
          <input [(ngModel)]="collectionCurrency" name="collectionCurrency" maxlength="3" required />
        </label>
        <label>
          {{ 'setup.imageStoragePath' | translate }}
          <input [(ngModel)]="imageStoragePath" name="imageStoragePath" required />
        </label>
        <button tuiButton type="submit" appearance="primary" size="m" [disabled]="running">
          {{ (running ? 'setup.running' : 'setup.complete') | translate }}
        </button>
      </form>
      <p *ngIf="error" role="alert" style="color:var(--tui-text-negative)">{{ error }}</p>
      <ul *ngIf="validationMessages.length" role="alert" style="color:var(--tui-text-negative)">
        <li *ngFor="let message of validationMessages">{{ message }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .setup-card { max-width: 28rem; margin: 3rem auto; padding: 2rem; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    label { display: flex; flex-direction: column; gap: 0.375rem; }
    label > input { min-height: 2.75rem; padding: 0 0.75rem; }
  `],
})
export class SetupComponent implements OnInit {
  running = false;
  error = '';
  adminUserName = '';
  adminPassword = '';
  collectionCurrency = 'EUR';
  imageStoragePath = 'images';
  validationMessages: string[] = [];

  constructor(
    private http: HttpClient,
    private session: SessionServiceImpl,
    private router: Router,
    private translations: TranslateService,
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const state = await firstValueFrom(this.http.get<SetupState>('/api/setup/state'));
      if (state.isSetupComplete) {
        await this.session.load();
        await this.router.navigate(['/catalog']);
      }
    } catch {
      this.error = this.translations.translate('setup.error');
    }
  }

  async runSetup() {
    this.running = true;
    this.error = '';
    this.validationMessages = [];
    const request = {
      adminUserName: this.adminUserName,
      adminPassword: this.adminPassword,
      defaultUiCulture: localStorage.getItem('archiveDexLanguage') ?? 'en',
      collectionCurrency: this.collectionCurrency.toUpperCase(),
      imageStoragePath: this.imageStoragePath,
    };

    try {
      const validation = await firstValueFrom(
        this.http.post<SetupValidation>('/api/setup/validate', request),
      );
      if (!validation.databaseReachable || !validation.storageWritable || validation.messages.length) {
        this.validationMessages = validation.messages;
        this.error = this.translations.translate('setup.validationError');
        return;
      }
      await firstValueFrom(this.http.post('/api/setup/complete', request));
      await this.session.signIn(this.adminUserName, this.adminPassword);
      await this.router.navigate(['/catalog']);
    } catch (error: unknown) {
      const response = error as { error?: { error?: string; detail?: string } };
      this.error = response.error?.error ?? response.error?.detail ?? this.translations.translate('setup.error');
    } finally {
      this.running = false;
    }
  }
}
