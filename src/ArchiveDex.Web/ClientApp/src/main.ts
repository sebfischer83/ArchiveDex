import { bootstrapApplication } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, Injectable, inject } from '@angular/core';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { errorInterceptor } from './app/core/error.interceptor';
import { antiforgeryInterceptor } from './app/core/antiforgery.interceptor';
import { TranslateService } from './app/core/translate.service';
import { SessionServiceImpl } from './app/core/session.service.impl';
import { BootService, describeError } from './app/core/boot.service';
import { tuiLanguageSwitcher } from '@taiga-ui/i18n';

@Injectable({ providedIn: 'root' })
class ArchiveDexTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} - ArchiveDex` : 'ArchiveDex');
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: ArchiveDexTitleStrategy },
    provideHttpClient(withInterceptors([antiforgeryInterceptor, errorInterceptor])),
    provideAnimations(),
    ...tuiLanguageSwitcher((language) => {
      switch (language) {
        case 'german':
          return import('@taiga-ui/i18n/languages/german');
        case 'russian':
          return import('@taiga-ui/i18n/languages/russian');
        default:
          return import('@taiga-ui/i18n/languages/english');
      }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (translations: TranslateService, session: SessionServiceImpl, boot: BootService) => async () => {
        try {
          await Promise.all([translations.initialize(), session.load()]);
          boot.markReady();
        } catch (err: unknown) {
          boot.setError({ type: 'both', message: describeError(err) });
        }
      },
      deps: [TranslateService, SessionServiceImpl, BootService],
      multi: true,
    },
  ],
}).catch((err: unknown) => console.error(err));
