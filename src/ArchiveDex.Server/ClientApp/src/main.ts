import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTaiga } from '@taiga-ui/core';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { SessionService } from './app/core/session.service';
import { TranslateService } from './app/core/translate.service';

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })),
    provideAppInitializer(() => Promise.all([
      inject(SessionService).initialize(),
      inject(TranslateService).initialize(),
    ])),
    provideAnimations(),
    provideTaiga(),
  ],
}).catch((err: unknown) => console.error(err));
