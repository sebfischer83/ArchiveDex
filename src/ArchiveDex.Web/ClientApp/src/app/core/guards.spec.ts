import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuard, SetupGuard } from './guards';
import { SessionServiceImpl } from './session.service.impl';

describe('route guards', () => {
  function session(state: Partial<SessionServiceImpl['state']>): SessionServiceImpl {
    return { state: { isAuthenticated: false, displayName: null, roles: [], setupRequired: false, ...state } } as SessionServiceImpl;
  }

  it('redirects anonymous users to sign in with their return URL', async () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    const guard = new AuthGuard(session({}), router);

    const allowed = await guard.canActivate(
      { data: {} } as ActivatedRouteSnapshot,
      { url: '/collection' } as RouterStateSnapshot,
    );

    expect(allowed).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in'], { queryParams: { returnUrl: '/collection' } });
  });

  it('redirects users without the required role', async () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    const guard = new AuthGuard(session({ isAuthenticated: true }), router);

    const allowed = await guard.canActivate(
      { data: { role: 'Administrator' } } as unknown as ActivatedRouteSnapshot,
      { url: '/admin' } as RouterStateSnapshot,
    );

    expect(allowed).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
  });

  it('allows users with the required role', async () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const guard = new AuthGuard(session({ isAuthenticated: true, roles: ['Administrator'] }), router);

    expect(await guard.canActivate(
      { data: { role: 'Administrator' } } as unknown as ActivatedRouteSnapshot,
      { url: '/admin' } as RouterStateSnapshot,
    )).toBeTrue();
  });

  it('only allows setup while setup is required', async () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    const blocked = new SetupGuard(session({ setupRequired: false }), router);
    const allowed = new SetupGuard(session({ setupRequired: true }), router);

    expect(await blocked.canActivate()).toBeFalse();
    expect(await allowed.canActivate()).toBeTrue();
  });
});
