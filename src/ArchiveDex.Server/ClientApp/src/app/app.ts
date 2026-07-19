import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="app-shell">
      <nav class="sidebar" aria-label="Main navigation">
        <a routerLink="/" class="brand">ArchiveDex</a>
        <a routerLink="/capture" routerLinkActive="active" class="nav-link">Erfassen</a>
        <a routerLink="/sets" routerLinkActive="active" class="nav-link">Sammlung</a>
      </nav>
      <main class="content"><router-outlet /></main>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; min-height: 100vh; }
    .sidebar { width: 200px; background: #f5f5f5; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .brand { font-size: 1.25rem; font-weight: 600; text-decoration: none; color: #333; margin-bottom: 1rem; }
    .nav-link { text-decoration: none; color: #555; padding: 0.5rem; border-radius: 4px; }
    .nav-link.active, .nav-link:hover { background: #e0e0e0; color: #111; }
    .content { flex: 1; padding: 2rem; }
    @media (max-width: 640px) { .app-shell { flex-direction: column; } .sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; } .content { padding: 1rem; } }
  `],
})
export class App {}
