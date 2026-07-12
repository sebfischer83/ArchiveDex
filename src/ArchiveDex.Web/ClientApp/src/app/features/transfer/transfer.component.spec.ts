import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { TransferComponent } from './transfer.component';
import { TranslateService } from '../../core/translate.service';

describe('TransferComponent', () => {
  let component: TransferComponent;
  let http: jasmine.SpyObj<HttpClient>;
  let translations: jasmine.SpyObj<TranslateService>;

  const activeExport = {
    id: 'op-1',
    kind: 'Export',
    status: 'Running',
    phase: 'Packaging',
    packageId: 'pkg-1',
    startedAt: '2026-01-01T00:00:00Z',
    finishedAt: null,
    processedRecords: 50,
    totalRecords: 200,
    processedImages: 30,
    totalImages: 100,
    validationSucceeded: null,
    errorCount: 2,
    warningCount: 5,
  };

  const activeImport = {
    ...activeExport,
    kind: 'Import',
    status: 'Running',
    phase: 'Restoring',
    validationSucceeded: true,
    packageId: null,
  };

  const report = {
    operation: activeExport,
    categoryCounts: { cards: 100, sets: 10 },
    errors: [
      { code: 'IMG_FAIL', message: 'Image download failed', impact: 'Missing image', recommendedAction: 'Retry import' },
    ],
  };

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
    translations.translate.and.returnValue('Translated');

    component = new TransferComponent(http, translations);
  });

  describe('initialization', () => {
    it('loads no active operation when none exists', async () => {
      http.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: {} })));
      component.ngOnInit();
      await fixtureStable();
      expect(component.activeOperation).toBeNull();
      expect(component.loadingActive).toBeFalse();
    });

    it('loads active export operation and starts polling', async () => {
      http.get.and.returnValue(of(activeExport));
      component.ngOnInit();
      await fixtureStable();
      expect(component.activeOperation?.kind).toBe('Export');
      expect(component.activeOperation?.status).toBe('Running');
      expect(component.loadingActive).toBeFalse();
    });

    it('handles load error', async () => {
      http.get.and.returnValue(throwError(() => new HttpErrorResponse({
        status: 500, statusText: 'Error',
      })));
      component.ngOnInit();
      await fixtureStable();
      expect(component.activeOperation).toBeNull();
      expect(component.loadingActive).toBeFalse();
    });
  });

  describe('export workflow', () => {
    it('starts an export', async () => {
      http.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: '', error: {} })));
      component.ngOnInit();
      await fixtureStable();

      http.post.and.returnValue(of({}));
      http.get.and.returnValue(of(activeExport));

      await component.startExport();

      expect(http.post).toHaveBeenCalledWith('/api/catalog-transfers/exports', {});
      expect(component.activeOperation?.id).toBe('op-1');
    });

    it('shows error when export start fails', async () => {
      http.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: '', error: {} })));
      component.ngOnInit();
      await fixtureStable();

      http.post.and.returnValue(throwError(() => new HttpErrorResponse({
        status: 400, statusText: 'Bad Request',
        error: { detail: 'An export is already in progress.' },
      })));

      await component.startExport();

      expect(component.actionError).toBe('An export is already in progress.');
    });
  });

  describe('import workflow', () => {
    it('handles file selection', () => {
      const file = new File(['test'], 'package.zip');
      const event = { target: { files: [file] } } as unknown as Event;
      component.onFileSelected(event);
      expect(component.selectedFile).toBe(file);
      expect(component.validationResult).toBeNull();
    });

    it('does not select file when no files present', () => {
      const event = { target: { files: [] } } as unknown as Event;
      component.onFileSelected(event);
      expect(component.selectedFile).toBeNull();
    });

    it('validates a package', async () => {
      component.selectedFile = new File(['test'], 'package.zip');

      const validationComplete = { ...activeImport, status: 'Completed', validationSucceeded: true };
      http.post.and.returnValue(of({ id: 'op-2', status: 'Validating' }));
      http.get.and.returnValue(of(validationComplete));

      await component.validatePackage();

      expect(http.post).toHaveBeenCalledWith(
        '/api/catalog-transfers/imports/validate',
        jasmine.any(FormData),
      );
      expect(component.importId).toBe('op-2');
      expect(component.validationResult?.valid).toBeTrue();
    });

    it('handles validation failure', async () => {
      component.selectedFile = new File(['test'], 'package.zip');
      const validationFailed = { ...activeImport, status: 'Completed', validationSucceeded: false };
      http.post.and.returnValue(of({ id: 'op-3', status: 'Validating' }));
      http.get.and.returnValue(of(validationFailed));

      await component.validatePackage();

      expect(component.validationResult?.valid).toBeFalse();
      expect(component.importId).toBeNull();
    });

    it('starts import restore', async () => {
      component.importId = 'op-4';
      http.post.and.returnValue(of({}));
      http.get.and.returnValue(of(activeImport));

      await component.startImportRestore();

      expect(http.post).toHaveBeenCalledWith('/api/catalog-transfers/imports/op-4/start', {});
      expect(component.importId).toBeNull();
      expect(component.activeOperation?.kind).toBe('Import');
    });

    it('does not start import restore without importId', async () => {
      component.importId = null;
      await component.startImportRestore();
      expect(http.post).not.toHaveBeenCalled();
    });
  });

  describe('cancel operation', () => {
    it('cancels the active operation', async () => {
      component.activeOperation = { ...activeExport };
      http.post.and.returnValue(of({}));
      http.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404, statusText: '', error: {} })));

      await component.cancelOperation();

      expect(http.post).toHaveBeenCalledWith('/api/catalog-transfers/op-1/cancel', {});
    });

    it('does not cancel without active operation', async () => {
      component.activeOperation = null;
      await component.cancelOperation();
      expect(http.post).not.toHaveBeenCalled();
    });
  });

  describe('progress calculation', () => {
    it('returns 0 when no operation', () => {
      component.activeOperation = null;
      expect(component.progressPercent()).toBe(0);
    });

    it('returns progress percentage', () => {
      component.activeOperation = { ...activeExport };
      expect(component.progressPercent()).toBe(25);
    });

    it('returns 0 when totalRecords is 0', () => {
      component.activeOperation = { ...activeExport, processedRecords: 0, totalRecords: 0 };
      expect(component.progressPercent()).toBe(0);
    });
  });

  describe('destruction', () => {
    it('stops polling on destroy', async () => {
      http.get.and.returnValue(of(activeExport));
      component.ngOnInit();
      await fixtureStable();

      const clearIntervalSpy = spyOn(window, 'clearInterval');
      component.ngOnDestroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});

async function fixtureStable(): Promise<void> {
  await Promise.resolve();
}
