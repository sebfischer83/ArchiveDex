import { Page, Route } from '@playwright/test';

export async function mockApi(page: Page): Promise<void> {
  await page.route('**/ng/assets/i18n/*.json', async route => {
    const language = route.request().url().split('/').pop()?.replace('.json', '');
    const german = language === 'de';
    return json(route, {
      nav: {
        catalog: german ? 'Katalog' : 'Catalog', collection: german ? 'Sammlung' : 'Collection',
        scan: 'Scan', import: 'Import', transfer: 'Transfer', admin: 'Administration', account: german ? 'Konto' : 'Account',
        main: german ? 'Hauptnavigation' : 'Main navigation', toggle: german ? 'Navigation umschalten' : 'Toggle navigation',
      },
      auth: { signIn: german ? 'Anmelden' : 'Sign In', signOut: german ? 'Abmelden' : 'Sign Out' },
      language: { label: german ? 'Sprache' : 'Language' },
      actions: { retry: german ? 'Erneut versuchen' : 'Retry' },
      catalog: {
        title: german ? 'Katalog' : 'Catalog', sets: german ? 'Sets' : 'Sets', cards: german ? 'Karten' : 'Cards',
        noSets: 'No sets found.', noCards: 'No cards found.', searchCards: 'Search cards...', cardDetail: 'Card Detail',
      },
      collection: {
        title: german ? 'Sammlung' : 'Collection', sets: 'Sets', entries: 'Entries', add: 'Add to Collection',
        noEntries: 'No entries.', condition: 'Condition', quantity: 'Quantity', purchasePrice: 'Purchase price',
        storageLocation: 'Storage location', notes: 'Notes', delete: 'Delete', confirmDelete: 'Confirm delete',
      },
      scan: {
        title: 'Scan Cards', upload: 'Upload Image', selectImage: 'Select a card image to scan', scanning: 'Processing image...',
        ocrComplete: 'OCR Results', confirm: 'Confirm', reject: 'Reject', noCandidates: 'No candidates found.', confidence: 'Confidence',
      },
      batchScan: {
        title: 'Batch Scan', noActiveBatch: 'No active batch scan.', start: 'Start Batch Scan', itemCount: 'Items',
        pending: 'Pending', accepted: 'Accepted', acceptAll: 'Accept All', detail: 'Item Detail', match: 'Match', noMatch: 'No Match', unmatched: 'Unknown',
      },
      import: { title: 'Import', fullImport: 'Full Import', legacyImport: 'Legacy Jobs', noActiveImport: 'No active import run.', startImport: 'Start Import' },
      transfer: { title: 'Transfer', export: 'Export', import: 'Import', noActive: 'No active transfer operation.', startExport: 'Start Export' },
      admin: { title: 'Administration', pendingMappings: 'Pending Set Mappings', noPendingMappings: 'No pending set mappings.' },
      states: { loading: 'Loading...', empty: 'No items found', error: 'An error occurred', notFound: 'Page not found', notFoundDetail: 'The requested page does not exist.', returnHome: 'Return to home' },
    });
  });
  await page.route('**/api/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path === '/api/session') return json(route, {
      isAuthenticated: true,
      displayName: 'admin',
      roles: ['Administrator'],
      setupRequired: false,
    });
    if (path === '/api/catalog/sets') return json(route, [{
      setId: 'set-1', name: 'Base Set', cardLanguage: 'en', cardCount: 1, ownedCount: 0, imageUrl: null,
    }]);
    if (path === '/api/catalog/cards' && request.method() === 'GET') return json(route, [{
      id: 'card-1', setId: 'set-1', number: '001', name: 'Bulbasaur', cardLanguage: 'en',
      rarity: 'Common', origin: 'Imported', imageUrl: null, hasLocalCorrection: false,
    }]);
    if (path === '/api/catalog/cards/card-1') return json(route, {
      id: 'card-1', setId: 'set-1', setName: 'Base Set', number: '001', name: 'Bulbasaur',
      cardLanguage: 'en', rarity: 'Common', imageUrl: null, origin: 'Imported', category: 'Pokemon',
      illustrator: null, hp: 40, types: ['Grass'], stage: 'Basic', evolveFrom: null,
      description: 'A strange seed was planted on its back at birth.', attacks: [], weaknesses: [],
      resistances: [], retreat: 1, hasLocalCorrection: false,
    });
    if (path === '/api/collection/sets') return json(route, [{
      setId: 'set-1', name: 'Base Set', cardLanguage: 'en', uniqueCards: 1, totalQuantity: 2,
    }]);
    if (path === '/api/collection' && request.method() === 'GET') return json(route, [{
      id: 'entry-1', cardId: 'card-1', cardName: 'Bulbasaur', cardLanguage: 'en', condition: 'NM',
      quantity: 2, purchasePrice: 2.5, storageLocation: 'Binder', notes: null, frontImageUrl: null,
      dateAdded: '2026-07-12T00:00:00Z',
    }]);
    if (path === '/api/collection' && request.method() === 'POST') return json(route, {}, 201);
    if (path.startsWith('/api/collection/') && request.method() === 'DELETE') return json(route, {}, 204);
    if (path === '/api/catalog-imports/active') return json(route, null);
    if (path === '/api/import/jobs') return json(route, []);
    if (path === '/api/catalog-transfers/active') return json(route, null);
    if (path === '/api/sets/pending') return json(route, []);
    if (path === '/api/account') return json(route, { username: 'admin' });

    return json(route, {});
  });
}

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
}
