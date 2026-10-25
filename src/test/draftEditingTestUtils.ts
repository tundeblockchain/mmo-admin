import { expect } from 'vitest';
import { type userEvent, screen, waitFor, within } from './test-utils';

export async function enterCatalogDraft(
  user: ReturnType<typeof userEvent.setup>,
  options: {
    versionLabel: RegExp;
    optionName: RegExp;
    publishedName: string;
  },
) {
  await waitFor(() => {
    expect(screen.getByLabelText(options.versionLabel)).toBeInTheDocument();
  });

  await user.click(screen.getByRole('combobox'));
  await user.click(await screen.findByRole('option', { name: options.optionName }));

  await waitFor(() => {
    expect(screen.getByText(options.publishedName)).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: /edit as draft/i }));

  await waitFor(() => {
    expect(screen.getByText(/editing draft/i)).toBeInTheDocument();
  });
}

export async function enterClassDraft(user: ReturnType<typeof userEvent.setup>) {
  await enterCatalogDraft(user, {
    versionLabel: /Classes Version/,
    optionName: /v2/,
    publishedName: 'Vanguard',
  });
}

export async function submitAddEntryForm(
  user: ReturnType<typeof userEvent.setup>,
  options: {
    openName: string | RegExp;
    dialogName: string | RegExp;
    idLabel: string;
    idValue: string;
  },
) {
  await user.click(screen.getByRole('button', { name: options.openName }));
  const dialog = await screen.findByRole('dialog', { name: options.dialogName });
  await user.type(within(dialog).getByRole('textbox', { name: options.idLabel }), options.idValue);
  await user.click(within(dialog).getByRole('button', { name: /add entry/i }));
  await waitFor(() => {
    expect(screen.queryByRole('dialog', { name: options.dialogName })).not.toBeInTheDocument();
  });
}

export async function submitAddClassEntry(
  user: ReturnType<typeof userEvent.setup>,
  classId: string,
) {
  await submitAddEntryForm(user, {
    openName: /add class/i,
    dialogName: /add class/i,
    idLabel: 'Class ID',
    idValue: classId,
  });
}
