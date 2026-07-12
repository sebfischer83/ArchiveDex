import { AccessDeniedComponent, ErrorStateComponent, NotFoundComponent } from './states.component';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '../core/translate.service';
import { provideRouter } from '@angular/router';

describe('shared states', () => {
  it('emits retry requests from the error state', () => {
    TestBed.configureTestingModule({
      imports: [ErrorStateComponent],
      providers: [{
        provide: TranslateService,
        useValue: { translate: (key: string) => key },
      }],
    });
    const component = TestBed.createComponent(ErrorStateComponent).componentInstance;
    const retry = jasmine.createSpy('retry');
    component.retry.subscribe(retry);

    component.onRetry();

    expect(retry).toHaveBeenCalled();
  });

  it('renders access-denied recovery copy', () => {
    TestBed.configureTestingModule({
      imports: [AccessDeniedComponent],
      providers: [{ provide: TranslateService, useValue: { translate: (key: string) => key } }],
    });

    const fixture = TestBed.createComponent(AccessDeniedComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('states.accessDenied');
    expect(text).toContain('states.accessDeniedDetail');
  });

  it('renders a not-found link back to the application', () => {
    TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        provideRouter([]),
        { provide: TranslateService, useValue: { translate: (key: string) => key } },
      ],
    });

    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/');
  });
});
