import { expect, test } from '@playwright/test';
import { mockApi } from './api-mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('browses a set, filters cards, and opens card details', async ({ page }) => {
  await page.goto('catalog');
  await page.getByText('Base Set', { exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search cards...' }).fill('Bulba');
  await page.getByRole('button', { name: /001 Bulbasaur/ }).click();

  await expect(page.getByRole('heading', { name: 'Card Detail' })).toBeVisible();
  await expect(page.getByText('A strange seed')).toBeVisible();
});

test('shows collection entries and validates required card input', async ({ page }) => {
  await page.goto('collection');
  await expect(page.getByText('Bulbasaur')).toBeVisible();
  await expect(page.getByText('Binder')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to Collection' })).toBeDisabled();
});
