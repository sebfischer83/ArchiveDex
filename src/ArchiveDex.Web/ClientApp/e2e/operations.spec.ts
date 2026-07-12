import { expect, test } from '@playwright/test';
import { mockApi } from './api-mocks';

test.beforeEach(async ({ page }) => mockApi(page));

test('shows import start and empty operation states', async ({ page }) => {
  await page.goto('import');
  await expect(page.getByRole('heading', { name: 'Import', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start Import' })).toBeVisible();
});

test('shows transfer and administration recovery states', async ({ page }) => {
  await page.goto('transfer');
  await expect(page.getByRole('button', { name: 'Start Export' })).toBeVisible();
  await page.goto('admin');
  await expect(page.getByText('No pending set mappings.')).toBeVisible();
});
