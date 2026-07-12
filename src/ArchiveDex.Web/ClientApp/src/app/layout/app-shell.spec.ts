import { App } from '../app';
import { SessionServiceImpl } from '../core/session.service.impl';
import { TranslateService } from '../core/translate.service';
import { BootService } from '../core/boot.service';

describe('App mobile navigation', () => {
  it('closes an open mobile menu when Escape is pressed', () => {
    const session = jasmine.createSpyObj<SessionServiceImpl>('SessionServiceImpl', ['signOut']);
    const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['load']);
    const boot = { error: jasmine.createSpy('error').and.returnValue(null), ready: jasmine.createSpy('ready') } as unknown as BootService;
    const component = new App(session, translations, boot);
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    spyOn(event, 'preventDefault');
    component.mobileMenuOpen.set(true);

    component.onKeydown(event);

    expect(component.mobileMenuOpen()).toBeFalse();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('closes mobile navigation above the responsive breakpoint', () => {
    const session = jasmine.createSpyObj<SessionServiceImpl>('SessionServiceImpl', ['signOut']);
    const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['load']);
    const boot = { error: jasmine.createSpy('error').and.returnValue(null), ready: jasmine.createSpy('ready') } as unknown as BootService;
    const component = new App(session, translations, boot);
    component.mobileMenuOpen.set(true);
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);

    component.onResize();

    expect(component.mobileMenuOpen()).toBeFalse();
  });
});
