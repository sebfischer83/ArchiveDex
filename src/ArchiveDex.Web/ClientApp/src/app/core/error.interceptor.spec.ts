import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { HttpClient } from '@angular/common/http';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/collection' });
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('routes unauthorized responses to sign in', () => {
    http.get('/api/protected').subscribe({ error: () => undefined });
    controller.expectOne('/api/protected').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(router.navigate).toHaveBeenCalledWith(['/sign-in'], { queryParams: { returnUrl: '/collection' } });
  });

  it('routes forbidden responses to access denied', () => {
    http.get('/api/admin').subscribe({ error: () => undefined });
    controller.expectOne('/api/admin').flush({}, { status: 403, statusText: 'Forbidden' });

    expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
  });
});
