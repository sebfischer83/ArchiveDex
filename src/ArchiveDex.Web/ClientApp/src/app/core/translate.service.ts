import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TuiLanguageName, TuiLanguageSwitcherService } from '@taiga-ui/i18n';

export type AppLanguage = 'de' | 'en' | 'ru';

const supportedLanguages: readonly AppLanguage[] = ['de', 'en', 'ru'];
const taigaLanguages: Record<AppLanguage, TuiLanguageName> = {
  de: 'german',
  en: 'english',
  ru: 'russian',
};

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private data = signal<Record<string, string>>({});
  readonly lang = signal<AppLanguage>('en');

  constructor(
    private http: HttpClient,
    private taigaLanguage: TuiLanguageSwitcherService,
  ) {}

  initialize(): Promise<void> {
    const stored = localStorage.getItem('archiveDexLanguage');
    const browser = navigator.language.slice(0, 2);
    const language = supportedLanguages.includes(stored as AppLanguage)
      ? stored as AppLanguage
      : supportedLanguages.includes(browser as AppLanguage) ? browser as AppLanguage : 'en';

    return this.load(language);
  }

  async load(lang: AppLanguage): Promise<void> {
    const catalog = await firstValueFrom(
      this.http.get<Record<string, unknown>>(`/assets/i18n/${lang}.json`)
    );
    this.lang.set(lang);
    this.data.set(this.flatten(catalog));
    this.taigaLanguage.setLanguage(taigaLanguages[lang]);
    localStorage.setItem('archiveDexLanguage', lang);
    document.documentElement.lang = lang;
  }

  translate(key: string): string {
    const value = this.data()[key];
    return value ?? key;
  }

  private flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        Object.assign(result, this.flatten(v as Record<string, unknown>, fullKey));
      } else {
        result[fullKey] = String(v);
      }
    }
    return result;
  }
}
