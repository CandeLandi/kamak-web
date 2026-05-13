import { expect, type Locator, test } from '@playwright/test';

const visibleBox = async (locator: Locator) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
};

test.describe('home page', () => {
  test('renders the main brand and calls to action', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('app-hero');

    await expect(hero.getByAltText('Kamak Desarrollos')).toBeVisible();
    await expect(
      hero.getByRole('heading', { name: /La forma m.s r.pida y eficiente de construir tu negocio/i }),
    ).toBeVisible();
    await expect(hero.getByRole('link', { name: /Hablemos/i })).toBeVisible();
    await expect(hero.getByRole('link', { name: /Ver proyectos/i })).toBeVisible();
  });

  test('does not overflow horizontally on mobile hero', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const hero = page.locator('app-hero');

    const logo = hero.getByAltText('Kamak Desarrollos');
    const badge = hero.getByText(/Trabajamos 24\/7/i);

    const logoBox = await visibleBox(logo);
    const badgeBox = await visibleBox(badge);
    const viewportWidth = page.viewportSize()!.width;

    expect(logoBox.x).toBeGreaterThanOrEqual(0);
    expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(viewportWidth);
    expect(badgeBox.x).toBeGreaterThanOrEqual(0);
    expect(badgeBox.x + badgeBox.width).toBeLessThanOrEqual(viewportWidth);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewportWidth);
  });
});
