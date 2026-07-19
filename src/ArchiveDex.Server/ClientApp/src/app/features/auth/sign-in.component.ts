import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../core/session.service';
import { TranslatePipe } from '../../core/translate.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="sign-in">
      <h2>{{ 'auth.signIn' | translate }}</h2>
      <form (ngSubmit)="doSignIn()">
        <label>{{ 'auth.username' | translate }} <input [(ngModel)]="userName" name="user" required /></label>
        <label>{{ 'auth.password' | translate }} <input type="password" [(ngModel)]="password" name="pass" required /></label>
        <button type="submit" [disabled]="loading">{{ 'auth.signIn' | translate }}</button>
      </form>
      @if (error) {
        <p class="error" role="alert">{{ error }}</p>
      }
    </div>
  `,
  styles: [`.sign-in{max-width:24rem;margin:2rem auto}form{display:flex;flex-direction:column;gap:1rem}label{display:flex;flex-direction:column;gap:.25rem}input{min-height:2.5rem;padding:.5rem}button{min-height:2.5rem}.error{color:#c00}`],
})
export class SignInComponent {
  userName = ''; password = ''; loading = false; error = '';
  constructor(private session: SessionService, private router: Router) {}
  async doSignIn() {
    this.loading = true; this.error = '';
    try { await this.session.signIn(this.userName, this.password); await this.router.navigate(['/capture']); }
    catch { this.error = 'Invalid credentials.'; }
    finally { this.loading = false; }
  }
}
