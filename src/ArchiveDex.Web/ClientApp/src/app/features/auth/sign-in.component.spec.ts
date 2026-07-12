import { ActivatedRoute, Router } from '@angular/router';
import { SessionServiceImpl } from '../../core/session.service.impl';
import { TranslateService } from '../../core/translate.service';
import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  it('returns the user to the protected route after sign in', async () => {
    const session = jasmine.createSpyObj<SessionServiceImpl>('SessionServiceImpl', ['signIn'], {
      state: { isAuthenticated: true, displayName: 'admin', roles: [], setupRequired: false },
    });
    session.signIn.and.resolveTo();
    const router = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    router.navigateByUrl.and.resolveTo(true);
    const route = {
      snapshot: { queryParamMap: { get: (key: string) => key === 'returnUrl' ? '/collection' : null } },
    } as unknown as ActivatedRoute;
    const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
    const component = new SignInComponent(session, router, route, translations);
    component.username = 'admin';
    component.password = 'Password1!';

    await component.submit();

    expect(session.signIn).toHaveBeenCalledWith('admin', 'Password1!');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/collection');
  });

  it('does not navigate to an external return URL', async () => {
    const session = jasmine.createSpyObj<SessionServiceImpl>('SessionServiceImpl', ['signIn'], {
      state: { isAuthenticated: true, displayName: 'admin', roles: [], setupRequired: false },
    });
    session.signIn.and.resolveTo();
    const router = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    router.navigateByUrl.and.resolveTo(true);
    const route = {
      snapshot: { queryParamMap: { get: () => 'https://example.com' } },
    } as unknown as ActivatedRoute;
    const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
    const component = new SignInComponent(session, router, route, translations);

    await component.submit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/catalog');
  });
});
