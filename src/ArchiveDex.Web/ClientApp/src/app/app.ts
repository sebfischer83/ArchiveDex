import { Component, signal, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TuiRoot } from '@taiga-ui/core';
import { SessionServiceImpl } from './core/session.service.impl';
import { AppLanguage, TranslateService } from './core/translate.service';
import { TranslatePipe } from './core/translate.pipe';
import { BootService } from './core/boot.service';
import { BootstrapRecoveryComponent } from './shared/bootstrap-recovery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, TuiRoot, TranslatePipe, BootstrapRecoveryComponent],
  template: `
    @if (boot.error()) {
      <app-bootstrap-recovery />
    } @else {
      <tui-root>
      <!-- Mobile overlay -->
      @if (mobileMenuOpen()) {
        <div class="overlay mobile-open" (click)="closeMobile()" aria-hidden="true"></div>
      }
      <div class="app-shell">
        <nav id="main-navigation" #mobileNav class="sidebar" [class.mobile-open]="mobileMenuOpen()" [attr.aria-label]="'nav.main' | translate">
          <div class="brand-row">
            <a routerLink="/" class="brand" (click)="closeMobile()">ArchiveDex</a>
            <button class="hamburger" (click)="toggleMobile($event)" aria-controls="main-navigation" [attr.aria-label]="'nav.toggle' | translate" [attr.aria-expanded]="mobileMenuOpen()">
              <span></span><span></span><span></span>
            </button>
          </div>
          <a routerLink="/catalog" class="nav-link" routerLinkActive="active-link" (click)="closeMobile()">{{ 'nav.catalog' | translate }}</a>
          <a routerLink="/collection" class="nav-link" routerLinkActive="active-link" (click)="closeMobile()">{{ 'nav.collection' | translate }}</a>
          <a routerLink="/scan" class="nav-link" routerLinkActive="active-link" (click)="closeMobile()">{{ 'nav.scan' | translate }}</a>
          @if (session.state.roles.includes('Administrator')) {
            <a routerLink="/import" class="nav-link" routerLinkActive="active-link" (click)="closeMobile()">{{ 'nav.import' | translate }}</a>
            <a routerLink="/transfer" class="nav-link" routerLinkActive="active-link" (click)="closeMobile()">{{ 'nav.transfer' | translate }}</a>
            <a routerLink="/admin" class="nav-link" routerLinkActive="active-link" (click)="closeMobile()">{{ 'nav.admin' | translate }}</a>
          }
          <div class="spacer"></div>
          <label class="language-picker">
            <span>{{ 'language.label' | translate }}</span>
            <select [value]="translations.lang()" (change)="changeLanguage($event)">
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </label>
          @if (session.state.isAuthenticated) {
            <a routerLink="/account" class="nav-link user" routerLinkActive="active-link" (click)="closeMobile()">{{ session.state.displayName }}</a>
            <button type="button" (click)="signOut(); closeMobile()" class="nav-link nav-button">{{ 'auth.signOut' | translate }}</button>
          } @else {
            <a routerLink="/sign-in" class="nav-link" (click)="closeMobile()">{{ 'auth.signIn' | translate }}</a>
          }
        </nav>
        <main class="content">
          <div class="sr-announce" role="status" aria-live="polite" aria-atomic="true"></div>
          <!-- Mobile header with hamburger -->
          <div class="mobile-header">
            <button class="hamburger" (click)="toggleMobile($event)" aria-controls="main-navigation" [attr.aria-label]="'nav.toggle' | translate" [attr.aria-expanded]="mobileMenuOpen()">
              <span></span><span></span><span></span>
            </button>
            <span class="mobile-title">ArchiveDex</span>
          </div>
          <router-outlet />
        </main>
      </div>
    </tui-root>
    }
  `,
  styles: [`
    .app-shell { display: flex; min-height: 100vh; }
    .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 49; }
    .sidebar {
      width: 220px; min-width: 220px; background: var(--tui-background-base);
      border-right: 1px solid var(--tui-border-normal); display: flex; flex-direction: column;
      padding: 1rem 0; transition: transform 0.25s ease; z-index: 50;
    }
    .brand-row { display: flex; align-items: center; justify-content: space-between; padding: 0 1rem 1rem; }
    .brand { font-size: 1.25rem; font-weight: 600; text-decoration: none; color: var(--tui-text-primary); }
    .hamburger { display: none; background: none; border: none; cursor: pointer; min-width: 2.75rem; min-height: 2.75rem; padding: 0.75rem; flex-direction: column; justify-content: center; gap: 4px; }
    .hamburger span { display: block; width: 20px; height: 2px; background: var(--tui-text-primary); border-radius: 1px; }
    .nav-link { display: flex; align-items: center; min-height: 2.75rem; padding: 0 1.5rem; text-decoration: none; color: var(--tui-text-secondary); cursor: pointer; }
    .nav-link:hover, .nav-link.active-link { color: var(--tui-text-primary); background: var(--tui-background-neutral-1); }
    .nav-button { width: 100%; border: 0; background: transparent; font: inherit; text-align: left; }
    .spacer { flex: 1; }
    .content { flex: 1; padding: 2rem; min-width: 0; }
    .user { color: var(--tui-text-primary); }
    .mobile-header { display: none; align-items: center; gap: 0.75rem; padding-bottom: 1rem; }
    .mobile-title { font-size: 1.1rem; font-weight: 600; }
    .sr-announce { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    .language-picker { display: grid; gap: 0.25rem; padding: 0.75rem 1.5rem; color: var(--tui-text-secondary); }
    .language-picker select { min-height: 2.75rem; padding: 0 0.5rem; }

    @media (max-width: 768px) {
      .overlay.mobile-open { display: block; }
      .sidebar {
        position: fixed; top: 0; left: 0; bottom: 0; transform: translateX(-100%);
        visibility: hidden;
        box-shadow: 2px 0 8px rgba(0,0,0,0.15);
      }
      .sidebar.mobile-open { transform: translateX(0); visibility: visible; }
      .hamburger { display: flex; }
      .content { padding: 1rem; }
      .mobile-header { display: flex; }
    }
  `],
})
export class App {
  @ViewChild('mobileNav') private mobileNav?: ElementRef<HTMLElement>;
  mobileMenuOpen = signal(false);
  private menuTrigger?: HTMLElement;
  constructor(
    public session: SessionServiceImpl,
    public translations: TranslateService,
    public boot: BootService,
  ) {}

  toggleMobile(event?: Event) {
    if (event?.currentTarget instanceof HTMLElement) this.menuTrigger = event.currentTarget;
    this.mobileMenuOpen.update(v => !v);
    if (this.mobileMenuOpen()) {
      queueMicrotask(() => this.focusableMenuElements()[0]?.focus());
    }
  }
  closeMobile(restoreFocus = false) {
    if (!this.mobileMenuOpen()) return;
    this.mobileMenuOpen.set(false);
    if (restoreFocus) queueMicrotask(() => this.menuTrigger?.focus());
  }

  async changeLanguage(event: Event) {
    await this.translations.load((event.target as HTMLSelectElement).value as AppLanguage);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.mobileMenuOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMobile(true);
      return;
    }
    if (event.key !== 'Tab') return;

    const elements = this.focusableMenuElements();
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  @HostListener('window:resize')
  onResize() { if (window.innerWidth > 768) this.mobileMenuOpen.set(false); }

  async signOut() { await this.session.signOut(); }

  private focusableMenuElements(): HTMLElement[] {
    return Array.from(this.mobileNav?.nativeElement.querySelectorAll<HTMLElement>('a, button, select') ?? []);
  }
}
