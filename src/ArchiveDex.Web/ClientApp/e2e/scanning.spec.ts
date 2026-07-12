import { expect, test } from '@playwright/test';
import { mockApi } from './api-mocks';

test('uploads, matches, and confirms a single scan', async ({ page }) => {
  await mockApi(page);
  await page.route('**/api/scans**', async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith('/confirm')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
    if (request.method() === 'POST') {
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({
        id: 'scan-1', status: 'OcrRunning', imageUrl: '/image.jpg',
      }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      id: 'scan-1', status: 'OcrComplete', imageUrl: '/image.jpg',
      ocr: {
        detectedNumber: '001', detectedName: 'Bulbasaur', detectedCardLanguage: 'en',
        detectedSetHint: 'Base Set', confidence: 0.98,
        candidates: [{ cardId: 'card-1', score: 98, number: '001', name: 'Bulbasaur', rarity: 'Common', cardLanguage: 'en' }],
      },
    }) });
  });
  await page.route('**/image.jpg', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" />' }));

  await page.goto('scan');
  await page.locator('input[type=file]').setInputFiles({ name: 'card.png', mimeType: 'image/png', buffer: Buffer.from('image') });
  await page.getByRole('button', { name: 'Upload Image' }).click();
  await page.getByRole('button', { name: /001.*Bulbasaur/ }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(page.getByRole('button', { name: 'Upload Image' })).toBeVisible();
});

test('shows the batch upload state when no batch is active', async ({ page }) => {
  await mockApi(page);
  await page.route('**/api/batch-scans/active', route => route.fulfill({
    status: 404,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'not_found' }),
  }));

  await page.goto('batch-scan');

  await expect(page.getByRole('button', { name: 'Start Batch Scan' })).toBeDisabled();
});
