import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TuiRoot, TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { SessionService } from './core/session.service';
import { CaptureService } from './features/capture/capture.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, TuiRoot, TuiButton, TuiIcon, TuiTitle],
  template: `
    <tui-root>
      <div class="app-shell">
        <nav class="sidebar" aria-label="Main navigation">
          <a routerLink="/" class="brand"><span tuiTitle>ArchiveDex</span></a>
          <a tuiButton appearance="flat" routerLink="/capture" routerLinkActive="tui-active" class="nav-link">
            <tui-icon icon="@tui.camera" />
            Erfassen
            @if (captures.activeCaptureId() || captures.activeBatchId()) { <span class="capture-pending" title="Eine Erfassung läuft">●</span> }
          </a>
          <a tuiButton appearance="flat" routerLink="/sets" routerLinkActive="tui-active" class="nav-link">
            <tui-icon icon="@tui.layout-grid" />
            Sammlung
          </a>
          @if (session.state().isAuthenticated) {
            <button tuiButton appearance="flat" type="button" class="nav-link sign-out" (click)="signOut()">
              <tui-icon icon="@tui.log-out" />
              Abmelden
            </button>
          }
        </nav>
        <main class="content"><router-outlet /></main>
      </div>
    </tui-root>
  `,
  styles: [`
    .app-shell { display: flex; min-height: 100vh; }
    .sidebar { width: 200px; background: var(--tui-background-base-alt); padding: 1rem; display: flex; flex-direction: column; gap: 0.35rem; }
    .brand { text-decoration: none; color: var(--tui-text-primary); margin-bottom: 1rem; }
    .nav-link { justify-content: flex-start; }
    .capture-pending { margin-inline-start: auto; color: var(--tui-text-positive); font-size: .65rem; }
    .nav-link.tui-active { background: var(--tui-background-neutral-1); color: var(--tui-text-primary); }
    .sign-out { margin-top: auto; }
    .content { flex: 1; padding: 2rem; }
    @media (max-width: 640px) { .app-shell { flex-direction: column; } .sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; } .sign-out { margin-top: 0; } .content { padding: 1rem; } }
  `],
})
export class App {
  protected readonly session = inject(SessionService);
  protected readonly captures = inject(CaptureService);
  private readonly router = inject(Router);

  async signOut(): Promise<void> {
    await this.session.signOut();
    this.captures.clearActiveCapture();
    await this.router.navigate(['/sign-in']);
  }
}
