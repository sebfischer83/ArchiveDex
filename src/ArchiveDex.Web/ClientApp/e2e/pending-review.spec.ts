import { expect, test } from '@playwright/test';
import { mockApi } from './api-mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('reviews a pending card and makes the parked card visible', async ({ page }) => {
  await page.goto('admin');
  await expect(page.getByRole('heading', { name: 'Pending Card Mappings' })).toBeVisible();
  await expect(page.getByText('002 Parked Card', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /Assign to 002 Parked Card/ }).click();
  await expect(page.getByText('Resolution applied.')).toBeVisible();

  await page.goto('catalog/set/set-1/en');
  await expect(page.getByText('Parked Card')).toBeVisible();
});
