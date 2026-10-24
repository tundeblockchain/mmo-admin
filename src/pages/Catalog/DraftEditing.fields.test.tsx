import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '../../test/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { CatalogPage } from './CatalogPage';
import { clearDraftStoreForTesting } from '../../hooks/useDraftCatalog';

vi.mock('../../auth', () => ({
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-jwt-token'),
}));

describe('Draft Editing and Publishing', { timeout: 15_000 }, () => {
  beforeEach(() => {
    clearDraftStoreForTesting();
  });

  describe('Newly editable catalog fields (MMO-28)', () => {
    it('publishes skill resource effects and per-stack values as schema-correct decimals', async () => {
      const postCalled = vi.fn();
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
      );

      const user = userEvent.setup();
      render(<CatalogPage />);

      await user.click(screen.getByRole('tab', { name: 'Skills' }));
      const select = await screen.findByRole('combobox');
      await user.click(select);
      await user.click(await screen.findByRole('option', { name: /v1/ }));
      await user.click(await screen.findByRole('button', { name: /edit as draft/i }));
      await user.click(await screen.findByText('Cleaving Strike'));

      await user.click(screen.getByRole('button', { name: /resource effects/i }));
      const amount = screen.getByRole('spinbutton', { name: 'Amount' });
      await user.clear(amount);
      await user.type(amount, '12');

      await user.click(screen.getByRole('button', { name: /coefficients/i }));
      const stackTwo = screen.getByRole('spinbutton', { name: 'Stack 2 base power' });
      await user.clear(stackTwo);
      await user.type(stackTwo, '2.25');

      await user.click(screen.getByRole('button', { name: /publish skill/i }));
      expect(screen.getByText('Modified')).toBeInTheDocument();
      expect(screen.getByText('1 entities')).toBeInTheDocument();

      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      const posted = postCalled.mock.calls[0][0] as {
        data: Array<{
          resourceEffects: Array<{
            resourceId: string;
            amount: number;
            isPercentOfMax: boolean;
            perTargetBonus?: number;
          }>;
          coefficients: { perStack: { basePowerPerStack: number[] } };
        }>;
      };
      const skill = posted.data[0];
      expect(skill.resourceEffects[0]).toEqual({
        resourceId: 'resolve',
        amount: 12,
        isPercentOfMax: false,
        perTargetBonus: 8,
      });
      expect(skill.coefficients.perStack.basePowerPerStack).toEqual([1.5, 2.25, 2.6]);
    });

    it('blocks publish when a resource effect is missing its required id', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      await user.click(screen.getByRole('tab', { name: 'Skills' }));
      const select = await screen.findByRole('combobox');
      await user.click(select);
      await user.click(await screen.findByRole('option', { name: /v1/ }));
      await user.click(await screen.findByRole('button', { name: /edit as draft/i }));
      await user.click(await screen.findByText('Cleaving Strike'));

      await user.click(screen.getByRole('button', { name: /resource effects/i }));
      await user.click(screen.getByRole('button', { name: 'Add resource effect' }));

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /publish skill/i })).toBeDisabled();
    });

    it('publishes stat caps and dodge settings as schema-correct numbers and decimals', async () => {
      const postCalled = vi.fn();
      server.use(
        http.post('*/catalog/:catalogType/versions', async ({ request }) => {
          postCalled(await request.json());
          return HttpResponse.json(
            {
              catalogType: 'combat-constants',
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

      await user.click(screen.getByRole('tab', { name: 'Combat Constants' }));
      const select = await screen.findByRole('combobox');
      await user.click(select);
      await user.click(await screen.findByRole('option', { name: /v1/ }));
      await user.click(await screen.findByRole('button', { name: /edit as draft/i }));

      await user.click(screen.getByRole('button', { name: /stat caps/i }));
      const hardCap = screen.getByRole('spinbutton', { name: 'Hard Cap' });
      await user.clear(hardCap);
      await user.type(hardCap, '160');

      await user.click(screen.getByRole('button', { name: /^dodge$/i }));
      const maxDodge = screen.getByRole('spinbutton', { name: 'Max Dodge Chance (%)' });
      await user.clear(maxDodge);
      await user.type(maxDodge, '45');

      await user.click(screen.getByRole('button', { name: /publish combat constants/i }));
      expect(screen.getByText('Modified')).toBeInTheDocument();

      await user.click(await screen.findByRole('button', { name: /review & publish/i }));
      await user.click(await screen.findByRole('button', { name: /confirm publish/i }));

      await waitFor(() => {
        expect(postCalled).toHaveBeenCalled();
      });

      const posted = postCalled.mock.calls[0][0] as {
        data: {
          statCaps: { softCap: number; hardCap: number; softCapPenalty: number };
          dodge: { baseDodgeChance: number; maxDodgeChance: number };
        };
      };
      expect(posted.data.statCaps).toEqual({
        softCap: 100,
        hardCap: 160,
        softCapPenalty: 0.5,
      });
      expect(posted.data.dodge).toEqual({
        baseDodgeChance: 0.02,
        maxDodgeChance: 0.45,
      });
    });

    it('blocks publish when a stat cap is not an integer', async () => {
      const user = userEvent.setup();
      render(<CatalogPage />);

      await user.click(screen.getByRole('tab', { name: 'Combat Constants' }));
      const select = await screen.findByRole('combobox');
      await user.click(select);
      await user.click(await screen.findByRole('option', { name: /v1/ }));
      await user.click(await screen.findByRole('button', { name: /edit as draft/i }));

      await user.click(screen.getByRole('button', { name: /stat caps/i }));
      const softCap = screen.getByRole('spinbutton', { name: 'Soft Cap' });
      await user.clear(softCap);
      await user.type(softCap, '100.5');

      expect(screen.getByText('Must be an integer')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /publish combat constants/i })).toBeDisabled();
    });
  });
});
