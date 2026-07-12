import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CatalogComponent } from './catalog.component';

describe('CatalogComponent', () => {
  function create(id: string | null = null) {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    const route = { snapshot: { paramMap: { get: () => id } } } as unknown as ActivatedRoute;
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['markForCheck']);
    const component = new CatalogComponent(http, route, router, cdr);
    return { component, http, router };
  }

  it('loads all cards on page one without requiring a set', async () => {
    const { component, http } = create();
    http.get.and.callFake(((url: string) => of(url.endsWith('/sets') ? [] : [{ id: 'card-1' }])) as never);

    await (component as unknown as { loadCatalog(): Promise<void> }).loadCatalog();

    const cardRequest = http.get.calls.allArgs().find(([url]) => url === '/api/catalog/cards');
    expect(cardRequest).toBeDefined();
    expect((cardRequest?.[1] as { params: { get(name: string): string | null } }).params.get('page')).toBe('1');
    expect(component.cards.length).toBe(1);
  });

  it('retains server filters while loading the next page', async () => {
    const { component, http } = create();
    http.get.and.returnValues(of([{ id: 'first' }]), of([{ id: 'second' }]));
    component.query = 'Pika';
    component.number = '025';
    component.setId = 'set-id';
    component.language = 'en';

    await component.search();
    await component.loadMore();

    const params = (http.get.calls.mostRecent().args[1] as { params: { get(name: string): string | null } }).params;
    expect(params.get('q')).toBe('Pika');
    expect(params.get('number')).toBe('025');
    expect(params.get('setId')).toBe('set-id');
    expect(params.get('cardLanguage')).toBe('en');
    expect(params.get('page')).toBe('2');
    expect(component.cards.map(card => card.id)).toEqual(['first', 'second']);
  });

  it('loads a card detail directly from the route id', async () => {
    const { component, http } = create('card-id');
    http.get.and.returnValue(of({ id: 'card-id', name: 'Pikachu' }));

    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve));

    expect(http.get).toHaveBeenCalledWith('/api/catalog/cards/card-id');
    expect(component.detail?.name).toBe('Pikachu');
  });

  it('preserves the form and offers duplicate resolution', async () => {
    const { component, http } = create('card-id');
    component.detail = { id: 'card-id' } as never;
    component.notes = 'keep me';
    http.post.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 409, error: { existingQuantity: 1, proposedQuantity: 2 } })),
      of({ id: 'entry-id' }),
    );

    await component.addToCollection();
    expect(component.duplicate).not.toBeNull();
    expect(component.notes).toBe('keep me');

    await component.addToCollection({ mergeDuplicate: true });
    expect(http.post.calls.mostRecent().args[1]).toEqual(jasmine.objectContaining({ mergeDuplicate: true }));
    expect(component.addSuccess).toBeTrue();
  });
});
