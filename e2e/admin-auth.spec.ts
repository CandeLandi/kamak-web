import { expect, test } from '@playwright/test';

test.describe('admin auth', () => {
  test('redirects unauthenticated dashboard visits to admin login', async ({ page }) => {
    await page.goto('/admin/dashboard');

    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
