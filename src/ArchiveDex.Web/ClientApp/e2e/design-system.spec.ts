import { expect, test } from '@playwright/test';
import { mockApi } from './api-mocks';

test.beforeEach(async ({ page }) => mockApi(page));

test('switches localization and keeps controls labelled', async ({ page }) => {
  await page.goto('catalog');
  await page.getByLabel('Language').selectOption('de');
  await expect(page.getByRole('heading', { name: 'Katalog' })).toBeVisible();
  await expect(page.getByRole('searchbox')).toHaveAccessibleName('Sets');
});

test('fits primary content on a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('collection');
  const width = await page.locator('body').evaluate(body => body.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});
