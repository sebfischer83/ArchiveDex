import { Injectable, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TUI_DARK_MODE } from '@taiga-ui/core';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // TUI_DARK_MODE seeds itself from prefers-color-scheme and persists changes under the "tuiDark" key.
  private readonly darkMode = inject(TUI_DARK_MODE);
  private readonly document = inject(DOCUMENT);

  readonly theme = () => (this.darkMode() ? 'dark' : 'light') as AppTheme;

  constructor() {
    // Must sit below <html>: Taiga's palette defines the dark vars on [tuiTheme='dark'] but the light ones on
    // :root, at equal specificity and later in the sheet, so the attribute on <html> itself loses to :root.
    effect(() => this.document.body.setAttribute('tuiTheme', this.theme()));
  }

  set(theme: AppTheme): void {
    this.darkMode.set(theme === 'dark');
  }

  toggle(): void {
    this.darkMode.update(dark => !dark);
  }
}
