import { describe, expect, it } from 'vitest';
import { CATALOG_SECTIONS } from '../../lib/catalogRoutes';
import { act, screen, userEvent } from '../../test/test-utils';
import { clickCatalogNav, renderCatalogApp, renderCatalogRouter } from '../../test/renderCatalogApp';

describe('Catalog routes', () => {
  it.each(CATALOG_SECTIONS)(
    'shows the $label heading on /catalog/$slug',
    ({ slug, label }) => {
      renderCatalogApp(`/catalog/${slug}`);

      expect(screen.getByRole('heading', { name: label, level: 1 })).toBeInTheDocument();
    },
  );

  it('redirects /catalog to /catalog/classes', async () => {
    renderCatalogApp('/catalog');

    expect(await screen.findByLabelText(/Classes Version/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Classes' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('redirects unknown catalog sections to classes', async () => {
    renderCatalogApp('/catalog/not-a-section');

    expect(await screen.findByLabelText(/Classes Version/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Classes' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('opens a deep-linked catalog section', async () => {
    renderCatalogApp('/catalog/elements');

    expect(await screen.findByLabelText(/Elements Version/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Elements' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('restores the previous catalog section on browser back and forward', async () => {
    const user = userEvent.setup();
    const { router } = renderCatalogRouter(['/catalog/classes']);

    await clickCatalogNav(user, 'Skills');
    expect(await screen.findByLabelText(/Skills Version/)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/catalog/skills');

    await act(async () => {
      await router.navigate(-1);
    });
    expect(await screen.findByLabelText(/Classes Version/)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/catalog/classes');
    expect(screen.getByRole('link', { name: 'Classes' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await act(async () => {
      await router.navigate(1);
    });
    expect(await screen.findByLabelText(/Skills Version/)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/catalog/skills');
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
