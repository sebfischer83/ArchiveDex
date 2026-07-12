import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { TranslateService } from '../../core/translate.service';
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  it('loads the account and updates the password', async () => {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'put']);
    http.get.and.returnValue(of({ username: 'admin' }));
    http.put.and.returnValue(of({ message: 'updated' }));
    const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
    translations.translate.and.callFake(key => key);
    const component = new AccountComponent(http, translations);

    await component.load();
    component.newPassword = 'Updated1!';
    await component.updatePassword();

    expect(component.username).toBe('admin');
    expect(http.put).toHaveBeenCalledWith('/api/account', { newPassword: 'Updated1!' });
    expect(component.message).toBe('account.updated');
    expect(component.newPassword).toBe('');
  });
});
