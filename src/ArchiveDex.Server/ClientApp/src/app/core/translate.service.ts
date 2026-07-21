import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private data = signal<Record<string, string>>({});
  readonly lang = signal<string>('de');

  constructor(private http: HttpClient) {}

  async initialize(): Promise<void> {
    await this.load('de');
  }

  async load(lang: string): Promise<void> {
    // Relative path so it resolves against the <base href="/ui/"> (served at /ui/assets/...),
    // not the site root where the API — but not the SPA assets — lives.
    const catalog = await firstValueFrom(this.http.get<Record<string, string>>(`assets/i18n/${lang}.json`));
    this.lang.set(lang);
    this.data.set(catalog);
  }

  translate(key: string): string { return this.data()[key] ?? key; }
}

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private svc: TranslateService) {}
  transform(key: string): string { return this.svc.translate(key); }
}
