import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionServiceImpl, SessionState } from './session.service.impl';

describe('SessionServiceImpl', () => {
  const authenticated: SessionState = {
    isAuthenticated: true,
    displayName: 'admin',
    roles: ['Administrator'],
    setupRequired: false,
  };

  it('loads the server session', async () => {
    const get = jasmine.createSpy('get').and.returnValue(of(authenticated));
    const router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/catalog' });
    const service = new SessionServiceImpl({ get } as unknown as HttpClient, router);

    await service.load();

    expect(get).toHaveBeenCalledWith('/api/session');
    expect(service.state).toEqual(authenticated);
  });

  it('redirects to setup when setup is required', async () => {
    const get = jasmine.createSpy('get').and.returnValue(of({ ...authenticated, setupRequired: true }));
    const router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/catalog' });
    router.navigate.and.resolveTo(true);
    const service = new SessionServiceImpl({ get } as unknown as HttpClient, router);

    await service.load();

    expect(router.navigate).toHaveBeenCalledWith(['/setup']);
  });

  it('signs out and clears authenticated state', async () => {
    const http = {
      get: jasmine.createSpy('get').and.returnValue(of(authenticated)),
      post: jasmine.createSpy('post').and.returnValue(of({})),
    } as unknown as HttpClient;
    const router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/catalog' });
    router.navigate.and.resolveTo(true);
    const service = new SessionServiceImpl(http, router);
    await service.load();

    await service.signOut();

    expect(service.state.isAuthenticated).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});
