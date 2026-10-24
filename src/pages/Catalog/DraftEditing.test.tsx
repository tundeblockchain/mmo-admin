import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';
import {
  ADMIN_FORBIDDEN_PUBLISH_MESSAGE,
  BAD_REQUEST_PUBLISH_MESSAGE,
} from '../../components/catalog/PublishDialog';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

import { getIdToken } from '../../auth';

describe('Draft Editing and Publishing', () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Skill Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const skillsTab = screen.getByRole('tab', { name: 'Skills' });
      await user.click(skillsTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Skills Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Cleaving Strike'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Skill Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'Modified Strike');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish skill/i })).toBeEnabled();
    });
  });

  describe('Status Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const statusesTab = screen.getByRole('tab', { name: 'Statuses' });
      await user.click(statusesTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Statuses Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Flame')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Flame'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Status Editor' })).toBeInTheDocument();
      });

      const maxStacksInput = screen.getByRole('spinbutton', { name: 'Max Stacks' });
      await user.clear(maxStacksInput);
      await user.type(maxStacksInput, '5');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish status/i })).toBeEnabled();
    });
  });

  describe('Element Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const elementsTab = screen.getByRole('tab', { name: 'Elements' });
      await user.click(elementsTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Elements Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Fire')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Fire'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Element Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'Flame');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish element/i })).toBeEnabled();
    });
  });

  describe('Resonance Editor', () => {
    it('dirty draft enables Confirm publish', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      const resonanceTab = screen.getByRole('tab', { name: 'Resonance' });
      await user.click(resonanceTab);

      await waitFor(() => {
        expect(screen.getByLabelText(/Resonance Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Valor')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText('Valor'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Resonance Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.clear(displayNameInput);
      await user.type(displayNameInput, 'Courage');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /publish resonance/i })).toBeEnabled();
    });
  });

  describe('Publish flow', () => {
    it('publishes via JWT POST and does not PATCH', async () => {
      const postCalled = vi.fn();
      const patchCalled = vi.fn();

      server.use(
        http.post('*/catalog/:catalogType/versions', async ({ request }) => {
          postCalled(await request.json());
          return HttpResponse.json(
            {
              catalogType: 'skill',
              version: 2,
              status: 'published',
              createdAt: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
              createdBy: 'test-user',
            },
            { status: 201 },
          );
        }),
        http.patch('*/catalog/*', () => {
          patchCalled();
          return HttpResponse.json({ error: 'Not allowed' }, { status: 405 });
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);

      const skillsTab = screen.getByRole('tab', { name: 'Skills' });
      await user.click(skillsTab);

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await user.click(screen.getByText('Cleaving Strike'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Skill Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.type(displayNameInput, ' Modified');

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish skill/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /publish skill catalog/i })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /review & publish/i }));
      await user.click(screen.getByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      expect(patchCalled).not.toHaveBeenCalled();

      const postedData = postCalled.mock.calls[0][0];
      expect(postedData).toHaveProperty('data');
      expect(Array.isArray(postedData.data)).toBe(true);
    });

    it('does not use PATCH method for publishing', async () => {
      const patchCalled = vi.fn();

      server.use(
        http.patch('*/catalog/*', () => {
          patchCalled();
          return HttpResponse.json({ error: 'Not allowed' }, { status: 405 });
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);

      const skillsTab = screen.getByRole('tab', { name: 'Skills' });
      await user.click(skillsTab);

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await user.click(screen.getByText('Cleaving Strike'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Skill Editor' })).toBeInTheDocument();
      });

      const displayNameInput = screen.getByRole('textbox', { name: 'Display Name' });
      await user.type(displayNameInput, ' X');

      await user.click(screen.getByRole('button', { name: /publish skill/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(
        () => {
          expect(screen.getByText(/published skill/i)).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      expect(patchCalled).not.toHaveBeenCalled();
    });
  });

  describe('Percent serialization', () => {
    it('serializes percent values as decimals in POST request', async () => {
      const postCalled = vi.fn();

      server.use(
        http.post('*/catalog/:catalogType/versions', async ({ request }) => {
          postCalled(await request.json());
          return HttpResponse.json(
            {
              catalogType: 'resonance',
              version: 2,
              status: 'published',
              createdAt: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
              createdBy: 'test-user',
            },
            { status: 201 },
          );
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);

      const resonanceTab = screen.getByRole('tab', { name: 'Resonance' });
      await user.click(resonanceTab);

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Valor')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit as draft/i });
      await user.click(editButton);

      await user.click(screen.getByText('Valor'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Resonance Editor' })).toBeInTheDocument();
      });

      const spinbuttons = screen.getAllByRole('spinbutton');
      const hpBonusInput = spinbuttons.find((input) =>
        input.closest('tr')?.querySelector('input')?.value === 'hp',
      );

      if (hpBonusInput) {
        await user.clear(hpBonusInput);
        await user.type(hpBonusInput, '15');
      }

      await waitFor(() => {
        expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish resonance/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      const postedData = postCalled.mock.calls[0][0];
      expect(postedData.data[0].partyBonus[0].bonusPercent).toBe(0.15);
    });
  });

  describe('Add and delete draft entries (MMO-25)', () => {
    async function enterClassDraft(user: ReturnType<typeof userEvent.setup>) {
      await waitFor(() => {
        expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v2/ });
      await user.click(option);

      await waitFor(() => {
        expect(screen.getByText('Vanguard')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /edit as draft/i }));

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });
    }

    it('adds a class with OpenAPI seed-shaped defaults', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /add class/i }));

      expect(screen.getAllByText('New Class').length).toBeGreaterThan(0);
      expect(screen.getByRole('textbox', { name: 'Class ID' })).toHaveValue('');
      expect(screen.getByRole('spinbutton', { name: 'Strength' })).toHaveValue(10);
      expect(screen.getByRole('spinbutton', { name: 'Movement Speed' })).toHaveValue(5);
      expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    });

    it('blocks empty and duplicate ids and shows the error next to the field', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /add class/i }));

      const idInput = screen.getByRole('textbox', { name: 'Class ID' });
      expect(screen.getByText('ID is required')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /publish class/i })).toBeDisabled();

      await user.type(idInput, 'vanguard');

      expect(screen.getByText('ID must be unique within this draft')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /publish class/i })).toBeDisabled();
    });

    it('requires confirmation before deleting an entry', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));

      const dialog = await screen.findByRole('dialog', { name: /delete class/i });
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText(/only affects the working copy/i)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });
      expect(screen.getByText('Vanguard')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
        expect(screen.queryByText('Vanguard')).not.toBeInTheDocument();
      });
      expect(screen.getByText('Ranger')).toBeInTheDocument();
      expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    });

    it('shows added and removed counts in the publish diff', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /add class/i }));
      await user.type(screen.getByRole('textbox', { name: 'Class ID' }), 'warden');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /publish class/i })).toBeEnabled();
      });

      await user.click(screen.getByRole('button', { name: /publish class/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /publish class catalog/i })).toBeInTheDocument();
      });

      expect(screen.getByText('Added')).toBeInTheDocument();
      expect(screen.getByText('Removed')).toBeInTheDocument();
      expect(screen.getAllByText('1 entities')).toHaveLength(2);
      expect(screen.getByRole('button', { name: /review & publish/i })).toBeEnabled();
    });

    it('POSTs added entries and omits deleted ones without using PATCH', async () => {
      const postCalled = vi.fn();
      const patchCalled = vi.fn();

      server.use(
        http.post('*/catalog/:catalogType/versions', async ({ request }) => {
          postCalled(await request.json());
          return HttpResponse.json(
            {
              catalogType: 'class',
              version: 3,
              status: 'published',
              createdAt: new Date().toISOString(),
              publishedAt: new Date().toISOString(),
              createdBy: 'test-user',
            },
            { status: 201 },
          );
        }),
        http.patch('*/catalog/*', () => {
          patchCalled();
          return HttpResponse.json({ error: 'Not allowed' }, { status: 405 });
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /add class/i }));
      await user.type(screen.getByRole('textbox', { name: 'Class ID' }), 'warden');

      await user.click(screen.getByRole('button', { name: /publish class/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      expect(patchCalled).not.toHaveBeenCalled();

      const postedData = postCalled.mock.calls[0][0] as {
        data: Array<{ classId: string; startingStats: { movementSpeed: number } }>;
      };
      const ids = postedData.data.map((entry) => entry.classId);
      expect(ids).toContain('vanguard');
      expect(ids).toContain('warden');
      expect(ids).not.toContain('ranger');
      expect(postedData.data.find((entry) => entry.classId === 'warden')?.startingStats).toBeDefined();
    });

    it('does not offer add or delete on combat-constants', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      await user.click(screen.getByRole('tab', { name: 'Combat Constants' }));

      const select = await screen.findByRole('combobox');
      await user.click(select);
      const option = await screen.findByRole('option', { name: /v1/ });
      await user.click(option);

      await user.click(screen.getByRole('button', { name: /edit as draft/i }));

      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });

      expect(screen.queryByRole('button', { name: /add /i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete /i })).not.toBeInTheDocument();
    });

    it('adds a skill with seed-shaped defaults', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      await user.click(screen.getByRole('tab', { name: 'Skills' }));
      const select = await screen.findByRole('combobox');
      await user.click(select);
      await user.click(await screen.findByRole('option', { name: /v1/ }));

      await waitFor(() => {
        expect(screen.getByText('Cleaving Strike')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /edit as draft/i }));
      await waitFor(() => {
        expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: /add skill/i }));

      expect(screen.getAllByText('New Skill').length).toBeGreaterThan(0);
      expect(screen.getByRole('textbox', { name: 'Skill ID' })).toHaveValue('');
      expect(screen.getByRole('spinbutton', { name: 'Unlock Level' })).toHaveValue(1);

      await user.click(screen.getByRole('button', { name: /coefficients/i }));
      expect(screen.getByRole('spinbutton', { name: 'Base Power' })).toHaveValue(1.5);
    });

    it('blocks publishing an empty class draft until the wipe is confirmed', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish class/i }));

      expect(
        screen.getByText(/this will publish an empty class catalog and remove all entries/i),
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /review & publish/i }));
      expect(screen.getByRole('button', { name: /confirm publish/i })).toBeDisabled();

      await user.click(
        screen.getByRole('checkbox', {
          name: /i understand this will remove all class entries/i,
        }),
      );

      expect(screen.getByRole('button', { name: /confirm publish/i })).toBeEnabled();
    });

    it('shows an admin message on 403 and does not refresh or retry', async () => {
      let attempts = 0;
      server.use(
        http.post('*/catalog/:catalogType/versions', () => {
          attempts += 1;
          return HttpResponse.json({ error: 'Admin only' }, { status: 403 });
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByText('Vanguard'));
      const displayNameInput = await screen.findByRole('textbox', { name: 'Display Name' });
      await user.type(displayNameInput, ' Updated');

      await user.click(screen.getByRole('button', { name: /publish class/i }));
      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      expect(await screen.findByText(ADMIN_FORBIDDEN_PUBLISH_MESSAGE)).toBeInTheDocument();
      expect(attempts).toBe(1);
      expect(getIdToken).not.toHaveBeenCalledWith(true);
    });

    it('shows a clear message when the server rejects a 400 empty catalog', async () => {
      server.use(
        http.post('*/catalog/:catalogType/versions', () => {
          return HttpResponse.json(
            { error: 'Catalog data must not be an empty array' },
            { status: 400 },
          );
        }),
      );

      const user = userEvent.setup();
      render(<CatalogPage />);
      await enterClassDraft(user);

      await user.click(screen.getByRole('button', { name: /delete vanguard/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /delete ranger/i }));
      await user.click(screen.getByRole('button', { name: /^delete$/i }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /delete class/i })).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /publish class/i }));
      await user.click(screen.getByRole('button', { name: /review & publish/i }));
      await user.click(
        screen.getByRole('checkbox', {
          name: /i understand this will remove all class entries/i,
        }),
      );
      await user.click(screen.getByRole('button', { name: /confirm publish/i }));

      expect(await screen.findByText(BAD_REQUEST_PUBLISH_MESSAGE)).toBeInTheDocument();
    });
  });
});
