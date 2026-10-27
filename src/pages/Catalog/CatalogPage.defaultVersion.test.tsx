import { describe, expect, it } from 'vitest';
import { CATALOG_SECTIONS } from '../../lib/catalogRoutes';
import { formatCatalogType } from '../../lib/catalogLabels';
import { mockEmptyCatalogApi } from '../../test/emptyCatalogTestUtils';
import { renderCatalogApp } from '../../test/renderCatalogApp';
import { screen, userEvent, waitFor } from '../../test/test-utils';

const latestByType = {
  class: 2,
  skill: 1,
  'combat-constants': 1,
  status: 1,
  element: 1,
  resonance: 1,
} as const;

const publishedNameByType = {
  class: 'Vanguard',
  skill: 'Cleaving Strike',
  'combat-constants': 'Power Scaling',
  status: 'Flame',
  element: 'Fire',
  resonance: 'Valor',
} as const;

describe('Catalog pages default to the latest published version', () => {
  it.each(CATALOG_SECTIONS)(
    'loads the latest published $label version on open',
    async ({ type, slug, label }) => {
      renderCatalogApp(`/catalog/${slug}`);

      const picker = await screen.findByLabelText(`${label} Version`);
      expect(picker).toHaveTextContent(`v${latestByType[type]}`);
      expect(await screen.findByText(publishedNameByType[type])).toBeInTheDocument();
      expect(screen.getByText(`Viewing version ${latestByType[type]}`)).toBeInTheDocument();
    },
  );

  it('keeps an older version when the user selects it', async () => {
    const user = userEvent.setup();
    renderCatalogApp('/catalog/classes');

    const picker = await screen.findByLabelText(/Classes Version/);
    expect(picker).toHaveTextContent('v2');
    expect(await screen.findByText('Vanguard')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /v1/ }));

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveTextContent('v1');
    });
    expect(screen.getByText('Viewing version 1')).toBeInTheDocument();
    expect(screen.getByText('Vanguard')).toBeInTheDocument();
  });

  it.each(CATALOG_SECTIONS)(
    'shows an empty state for $label when nothing is published',
    async ({ type, slug, label }) => {
      mockEmptyCatalogApi();
      renderCatalogApp(`/catalog/${slug}`);

      expect(
        await screen.findByText(
          new RegExp(`no published ${formatCatalogType(type).toLowerCase()} catalog yet`, 'i'),
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(`No published versions available for ${label}.`)).toBeInTheDocument();
      expect(screen.queryByText(/select a version above/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument();
    },
  );
});
