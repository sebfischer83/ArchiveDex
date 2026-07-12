import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionServiceImpl } from '../../core/session.service.impl';
import { TranslateService } from '../../core/translate.service';
import { SetupComponent } from './setup.component';

describe('SetupComponent', () => {
  it('validates, completes, and signs in the administrator', async () => {
    const post = jasmine.createSpy('post').and.returnValues(
      of({ databaseReachable: true, storageWritable: true, messages: [] }),
      of({ success: true }),
    );
    const http = { post } as unknown as HttpClient;
    const session = jasmine.createSpyObj<SessionServiceImpl>('SessionServiceImpl', ['signIn']);
    session.signIn.and.resolveTo();
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
    translations.translate.and.callFake(key => key);
    const component = new SetupComponent(http, session, router, translations);
    component.adminUserName = 'admin';
    component.adminPassword = 'Password1!';
    component.imageStoragePath = '/data/images';

    await component.runSetup();

    expect(post).toHaveBeenCalledWith('/api/setup/validate', jasmine.any(Object));
    expect(post).toHaveBeenCalledWith('/api/setup/complete', jasmine.any(Object));
    expect(post.calls.argsFor(0)[1]).toEqual(jasmine.objectContaining({ imageStoragePath: '/data/images' }));
    expect(session.signIn).toHaveBeenCalledWith('admin', 'Password1!');
    expect(router.navigate).toHaveBeenCalledWith(['/catalog']);
  });

  for (const validation of [
    { databaseReachable: false, storageWritable: true, messages: [] },
    { databaseReachable: true, storageWritable: false, messages: ['Storage is not writable.'] },
    { databaseReachable: true, storageWritable: true, messages: ['Invalid configuration.'] },
  ]) {
    it('does not complete when any validation result fails', async () => {
      const post = jasmine.createSpy('post').and.returnValue(of(validation));
      const http = { post } as unknown as HttpClient;
      const session = jasmine.createSpyObj<SessionServiceImpl>('SessionServiceImpl', ['signIn']);
      const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
      const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
      translations.translate.and.callFake(key => key);
      const component = new SetupComponent(http, session, router, translations);
      component.adminUserName = 'admin';
      component.adminPassword = 'Password1!';

      await component.runSetup();

      expect(post).toHaveBeenCalledTimes(1);
      expect(session.signIn).not.toHaveBeenCalled();
      expect(component.adminUserName).toBe('admin');
      expect(component.validationMessages).toEqual(validation.messages);
    });
  }
});
