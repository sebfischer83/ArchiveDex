import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { TranslateService } from '../../core/translate.service';
import { ImportComponent } from './import.component';

describe('ImportComponent', () => {
  function create() {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    const translations = jasmine.createSpyObj<TranslateService>('TranslateService', ['translate']);
    translations.translate.and.callFake(key => key);
    return { component: new ImportComponent(http, translations), http };
  }

  it('starts a selective source/language/set job', async () => {
    const { component, http } = create();
    component.selectedSource = 'TCGdex'; component.selectedLanguage = 'de'; component.selectedSetIds = new Set(['set-1']);
    http.post.and.returnValue(of({ id: 'job-id' })); http.get.and.returnValue(of([]));

    await component.startSelectiveImport();

    expect(http.post).toHaveBeenCalledWith('/api/import/jobs', {
      source: 'TCGdex', setIds: ['set-1'], cardLanguages: ['de'],
    });
  });

  it('preserves full import language and image options', async () => {
    const { component, http } = create();
    component.importSources = 'TCGdex'; component.importLanguages = 'en,de';
    component.downloadImages = false; component.reanalyzeImages = true;
    const run = { id: 'run-id', status: 'Completed', checkpoints: [] };
    http.post.and.returnValue(of(run));
    http.get.and.callFake(((url: string) => of(url.endsWith('/errors?severity=Error') ? [] : url.endsWith('/report') ? { run, sourceSummaries: [], imageSummary: {} } : run)) as never);

    await component.startImport();

    expect(http.post.calls.first().args[1]).toEqual(jasmine.objectContaining({
      languagesBySource: { TCGdex: ['en', 'de'] },
      downloadImages: false,
      reanalyzeExistingImages: true,
    }));
  });
});
