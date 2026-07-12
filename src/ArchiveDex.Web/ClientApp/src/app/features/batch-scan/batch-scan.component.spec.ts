import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BatchScanComponent } from './batch-scan.component';

describe('BatchScanComponent', () => {
  function create(batchId: string | null = null) {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'put', 'delete']);
    const cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['markForCheck']);
    const route = { snapshot: { paramMap: { get: () => batchId } } } as unknown as ActivatedRoute;
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    return { component: new BatchScanComponent(http, cdr, route, router), http };
  }

  it('loads a route-bound batch with its review filter', async () => {
    const { component, http } = create('batch-id');
    http.get.and.returnValue(of({ batch: { id: 'batch-id', status: 'Ready' }, items: [] }));
    component.statusFilter = 'reviewed';

    await component.loadBatch();

    expect(http.get.calls.mostRecent().args[0]).toBe('/api/batch-scans/batch-id');
    const params = (http.get.calls.mostRecent().args[1] as { params: { get(name: string): string | null } }).params;
    expect(params.get('statusFilter')).toBe('reviewed');
  });

  it('accepts only selected matched items with collection defaults', async () => {
    const { component, http } = create('batch-id');
    component.active = { id: 'batch-id', status: 'Ready' } as never;
    component.items = [{ id: 'one', matchStatus: 'Matched' }, { id: 'two', matchStatus: 'Matched' }] as never;
    component.selectedItemIds = new Set(['two']);
    component.defaultCondition = 'LP'; component.defaultQuantity = 2; component.defaultStorageLocation = 'Binder';
    http.post.and.returnValue(of({ acceptedCount: 1 }));
    http.get.and.returnValue(of({ batch: component.active, items: [] }));

    await component.acceptAll();

    const body = http.post.calls.mostRecent().args[1] as { items: Array<{itemId:string;condition:string;quantity:number;storageLocation:string}> };
    expect(body.items.length).toBe(1); expect(body.items[0]).toEqual(jasmine.objectContaining({ itemId: 'two', condition: 'LP', quantity: 2, storageLocation: 'Binder' }));
  });
});
