import { test as base, expect, type Page } from '@playwright/test';
import { catalogLabelForType } from '../../src/lib/catalogRoutes';
import { installCatalogRoutes, type CatalogRouteOptions } from './catalog';
import { installE2EAuth, type E2EAuthRole } from './auth';

interface E2EFixtures {
  e2eAuth: E2EAuthRole;
  catalogApi: CatalogRouteOptions;
}

export const test = base.extend<E2EFixtures>({
  e2eAuth: ['admin', { option: true }],
  catalogApi: [{}, { option: true }],
  page: async ({ page, e2eAuth, catalogApi }, use) => {
    await installE2EAuth(page, e2eAuth);
    await installCatalogRoutes(page, catalogApi);
    await use(page);
  },
});

export { expect };

export async function selectCatalogVersion(
  page: Page,
  versionLabel: string | RegExp,
  optionName: string | RegExp,
): Promise<void> {
  await expect(page.getByLabel(versionLabel)).toBeVisible();
  await page.getByLabel(versionLabel).click();
  await page.getByRole('option', { name: optionName }).click();
}

export async function openCatalogDraft(
  page: Page,
  options: {
    section?: string;
    versionLabel: string | RegExp;
    optionName: string | RegExp;
    publishedName: string;
  },
): Promise<void> {
  await page.goto('/catalog');
  await expect(page.getByRole('heading', { name: catalogLabelForType('class'), level: 1 })).toBeVisible();

  if (options.section) {
    await page.getByRole('navigation', { name: 'Catalog' })
      .getByRole('link', { name: options.section })
      .click();
  }

  await selectCatalogVersion(page, options.versionLabel, options.optionName);
  await expect(page.getByText(options.publishedName)).toBeVisible();
  await page.getByRole('button', { name: /edit as draft/i }).click();
  await expect(page.getByText(/editing draft/i)).toBeVisible();
}

export async function openClassDraft(page: Page): Promise<void> {
  await openCatalogDraft(page, {
    versionLabel: /Classes Version/,
    optionName: /v2/,
    publishedName: 'Vanguard',
  });
}
