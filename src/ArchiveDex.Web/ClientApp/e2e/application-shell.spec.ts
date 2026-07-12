import { expect, test } from '@playwright/test';
import { mockApi } from './api-mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('loads a protected deep link and navigates within three actions', async ({ page }) => {
  await page.goto('catalog');
  await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();

  await page.getByRole('link', { name: 'Collection' }).click();
  await expect(page.getByRole('heading', { name: 'Collection', exact: true })).toBeVisible();
});

test('opens and closes responsive navigation with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('catalog');
  const toggle = page.getByRole('button', { name: 'Toggle navigation' }).last();
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
});

test('renders route recovery for unknown paths', async ({ page }) => {
  await page.goto('missing-route');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to home' })).toBeVisible();
});
