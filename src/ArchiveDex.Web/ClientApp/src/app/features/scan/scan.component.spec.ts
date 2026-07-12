import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ScanComponent } from './scan.component';

describe('ScanComponent', () => {
  function create() {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'get']);
    const cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['markForCheck']);
    const component = new ScanComponent(http, cdr);
    component.scan = { id: 'scan-id', status: 'OcrComplete', imageUrl: '', ocr: null };
    component.state = 'ocr-complete';
    component.selectedCandidateId = 'card-id';
    return { component, http };
  }

  it('submits all collection fields when confirming', async () => {
    const { component, http } = create();
    http.post.and.returnValue(of({ id: 'entry-id' }));
    component.condition = 'LP'; component.quantity = 2; component.purchasePrice = 3.5;
    component.storageLocation = 'Binder'; component.notes = 'Keep';

    await component.confirm();

    expect(http.post).toHaveBeenCalledWith('/api/scans/scan-id/confirm', {
      cardId: 'card-id', condition: 'LP', quantity: 2, purchasePrice: 3.5,
      storageLocation: 'Binder', notes: 'Keep',
    });
    expect(component.state).toBe('confirmed');
  });

  it('retains entered values and backend feedback after failure', async () => {
    const { component, http } = create();
    http.post.and.returnValue(throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'Invalid quantity.' } })));
    component.quantity = 2; component.notes = 'Keep';

    await component.confirm();

    expect(component.state).toBe('ocr-complete');
    expect(component.quantity).toBe(2); expect(component.notes).toBe('Keep');
    expect(component.confirmationError).toBe('Invalid quantity.');
  });
});
