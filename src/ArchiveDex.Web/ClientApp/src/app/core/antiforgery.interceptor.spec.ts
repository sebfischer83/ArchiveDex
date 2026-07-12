import { DOCUMENT } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { antiforgeryInterceptor } from './antiforgery.interceptor';

describe('antiforgeryInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  const documentStub = { cookie: '' };

  beforeEach(() => {
    documentStub.cookie = '';
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([antiforgeryInterceptor])),
        provideHttpClientTesting(),
        { provide: DOCUMENT, useValue: documentStub },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('adds the decoded token to unsafe API requests', () => {
    documentStub.cookie = 'theme=dark; XSRF-TOKEN=request%2Btoken';

    http.post('/api/collection', {}).subscribe();

    const request = controller.expectOne('/api/collection');
    expect(request.request.headers.get('X-XSRF-TOKEN')).toBe('request+token');
    request.flush({});
  });

  it('does not add the token to safe or non-API requests', () => {
    documentStub.cookie = 'XSRF-TOKEN=request-token';

    http.get('/api/session').subscribe();
    http.post('https://example.test/telemetry', {}).subscribe();

    expect(controller.expectOne('/api/session').request.headers.has('X-XSRF-TOKEN')).toBeFalse();
    expect(controller.expectOne('https://example.test/telemetry').request.headers.has('X-XSRF-TOKEN')).toBeFalse();
  });
});
