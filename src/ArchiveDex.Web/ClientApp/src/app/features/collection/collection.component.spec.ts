import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
  function create(id: string | null = null) {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'put', 'delete']);
    const route = { snapshot: { paramMap: { get: () => id } } } as unknown as ActivatedRoute;
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['markForCheck']);
    return { component: new CollectionComponent(http, route, router, cdr), http, router };
  }

  it('sends collection filters to the server', async () => {
    const { component, http } = create();
    http.get.and.returnValue(of([]));
    component.query = 'Pika'; component.setId = 'set-id'; component.language = 'en'; component.conditionFilter = 'NM';

    await component.searchEntries();

    const params = (http.get.calls.mostRecent().args[1] as { params: { get(name: string): string | null } }).params;
    expect(params.get('q')).toBe('Pika'); expect(params.get('setId')).toBe('set-id');
    expect(params.get('cardLanguage')).toBe('en'); expect(params.get('condition')).toBe('NM');
  });

  it('loads and updates a route-driven entry detail', async () => {
    const { component, http } = create('entry-id');
    http.get.and.returnValue(of({ id: 'entry-id', cardName: 'Pikachu', condition: 'NM', quantity: 1 }));
    http.put.and.returnValue(of({ id: 'entry-id', cardName: 'Pikachu', condition: 'LP', quantity: 2 }));
    component.ngOnInit(); await new Promise(resolve => setTimeout(resolve));
    component.detail!.condition = 'LP'; component.detail!.quantity = 2;

    await component.saveDetail();

    expect(http.put).toHaveBeenCalledWith('/api/collection/entry-id', jasmine.objectContaining({ condition: 'LP', quantity: 2 }));
    expect(component.success).toBe('updated');
  });

  it('uses the selected catalog card and preserves values on duplicate', async () => {
    const { component, http } = create();
    component.selectedCard = { id: 'card-id', name: 'Pikachu' } as never;
    component.notes = 'keep';
    http.post.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 409, error: { existingQuantity: 1, proposedQuantity: 2 } })),
      of({ id: 'entry-id' }),
    );
    http.get.and.returnValue(of([]));

    await component.addEntry();
    expect(http.post.calls.first().args[1]).toEqual(jasmine.objectContaining({ cardPrintId: 'card-id' }));
    expect(component.duplicate).not.toBeNull(); expect(component.notes).toBe('keep');

    await component.addEntry({ mergeDuplicate: true });
    expect(http.post.calls.mostRecent().args[1]).toEqual(jasmine.objectContaining({ mergeDuplicate: true }));
  });

  it('surfaces backend validation messages', async () => {
    const { component, http } = create('entry-id');
    component.detail = { id: 'entry-id', quantity: 0 } as never;
    http.put.and.returnValue(throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'Quantity must be at least 1.' } })));

    await component.saveDetail();

    expect(component.actionError).toBe('Quantity must be at least 1.');
  });
});
