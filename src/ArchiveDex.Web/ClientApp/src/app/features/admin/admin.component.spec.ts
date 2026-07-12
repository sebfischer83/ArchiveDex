import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminComponent } from './admin.component';
import { TranslateService } from '../../core/translate.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let http: jasmine.SpyObj<HttpClient>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;
  let translations: jasmine.SpyObj<TranslateService>;

  const pendingMapping = {
    id: 'm1',
    incomingSource: 'source1',
    incomingLanguage: 'en',
    incomingExternalId: 'ext-1',
    incomingName: 'Test Set',
    incomingReleaseDate: '2024-01-01',
    incomingPrintedTotal: 100,
    suggestedCardSetId: 'set-1',
    suggestedCardSetName: 'Suggested Set',
    score: 85,
    reasons: ['Name match', 'Date match'],
    status: 'Pending',
  };

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    cdr = jasmine.createSpyObj<ChangeDetectorRef>('ChangeDetectorRef', ['markForCheck']);
    translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
    translations.translate.and.returnValue('Translated error');

    http.get.and.returnValue(of([pendingMapping]));

    component = new AdminComponent(http, translations, cdr);
  });

  it('loads pending mappings on init', async () => {
    component.ngOnInit();
    expect(component.loading).toBeFalse();
    await fixtureStable();
    expect(component.mappings.length).toBe(1);
    expect(component.mappings[0].incomingName).toBe('Test Set');
    expect(component.loading).toBeFalse();
  });

  it('shows loading state while fetching mappings', () => {
    http.get.and.returnValue(of([]));
    component.loading = true;
    expect(component.loading).toBeTrue();
  });

  it('handles load error', async () => {
    http.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Error', error: {} })));
    component.ngOnInit();
    await fixtureStable();
    expect(component.loadError).toBeTruthy();
    expect(component.loading).toBeFalse();
  });

  it('shows empty state when no mappings', async () => {
    http.get.and.returnValue(of([]));
    component.ngOnInit();
    await fixtureStable();
    expect(component.mappings.length).toBe(0);
  });

  it('accepts a mapping', async () => {
    http.get.and.returnValue(of([pendingMapping]));
    http.post.and.returnValue(of({}));
    component.ngOnInit();
    await fixtureStable();

    await component.acceptMapping(component.mappings[0], 'set-1');

    expect(http.post).toHaveBeenCalledWith(
      `/api/sets/pending/${pendingMapping.id}/accept`,
      { cardSetId: 'set-1' },
    );
    expect(component.mappings[0].status).toBe('Accepted');
  });

  it('rejects a mapping', async () => {
    http.get.and.returnValue(of([pendingMapping]));
    http.post.and.returnValue(of({}));
    component.ngOnInit();
    await fixtureStable();

    await component.rejectMapping(component.mappings[0]);

    expect(http.post).toHaveBeenCalledWith(
      `/api/sets/pending/${pendingMapping.id}/reject`,
      {},
    );
    expect(component.mappings[0].status).toBe('Rejected');
  });

  it('creates a new set from mapping', async () => {
    http.get.and.returnValue(of([pendingMapping]));
    http.post.and.returnValue(of({}));
    component.ngOnInit();
    await fixtureStable();

    await component.createNewSet(component.mappings[0]);

    expect(http.post).toHaveBeenCalledWith(
      `/api/sets/pending/${pendingMapping.id}/create-new`,
      {},
    );
    expect(component.mappings[0].status).toBe('Created');
  });

  it('handles accept error and shows error message', async () => {
    http.get.and.returnValue(of([pendingMapping]));
    http.post.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { detail: 'Set already mapped.' },
    })));
    component.ngOnInit();
    await fixtureStable();

    await component.acceptMapping(component.mappings[0], 'set-1');

    expect(component.actionError).toBe('Set already mapped.');
  });

  it('opens and closes the relation dialog', () => {
    component.openRelationDialog(component.mappings[0]);
    expect(component.showRelationDialog).toBeTrue();
    expect(component.relationMapping).toBe(component.mappings[0]);

    component.closeRelationDialog();
    expect(component.showRelationDialog).toBeFalse();
    expect(component.relationMapping).toBeNull();
  });

  it('closes dialog on Escape key', () => {
    component.openRelationDialog(component.mappings[0]);
    expect(component.showRelationDialog).toBeTrue();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onEscape();

    expect(component.showRelationDialog).toBeFalse();
  });

  it('creates a relation via dialog', async () => {
    http.get.and.returnValue(of([pendingMapping]));
    http.post.and.returnValue(of({}));
    component.ngOnInit();
    await fixtureStable();
    component.openRelationDialog(component.mappings[0]);
    component.relationTargetId = 'target-set-id';
    component.relationType = 'Contains';

    await component.doCreateRelation();

    expect(http.post).toHaveBeenCalledWith(
      `/api/sets/pending/${pendingMapping.id}/relation`,
      { targetCardSetId: 'target-set-id', relationType: 'Contains' },
    );
    expect(component.showRelationDialog).toBeFalse();
  });

  it('disables buttons while processing', async () => {
    http.get.and.returnValue(of([pendingMapping]));
    let resolvePost!: (value: unknown) => void;
    http.post.and.returnValue(new Promise(resolve => { resolvePost = resolve; }) as unknown as ReturnType<HttpClient['post']>);
    component.ngOnInit();
    await fixtureStable();

    const promise = component.acceptMapping(component.mappings[0], 'set-1');
    expect(component.processingId).toBe('m1');

    resolvePost!({});
    await promise;
    expect(component.processingId).toBeNull();
  });
});

async function fixtureStable(): Promise<void> {
  await Promise.resolve();
}
