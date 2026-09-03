import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VersionPicker } from './VersionPicker';
import type { CatalogVersionSummary } from '../../types/catalog';

const mockVersions: CatalogVersionSummary[] = [
  { catalogType: 'class', version: 2, status: 'published', publishedAt: '2024-06-15T10:30:00.000Z' },
  { catalogType: 'class', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
  { catalogType: 'skill', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
];

describe('VersionPicker', () => {
  it('renders loading state', () => {
    render(
      <VersionPicker
        catalogType="class"
        versions={[]}
        selectedVersion={null}
        onVersionChange={vi.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByText('Loading versions...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Network error');
    render(
      <VersionPicker
        catalogType="class"
        versions={[]}
        selectedVersion={null}
        onVersionChange={vi.fn()}
        error={error}
      />
    );

    expect(screen.getByText(/Failed to load versions/)).toBeInTheDocument();
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it('renders empty state when no versions for type', () => {
    render(
      <VersionPicker
        catalogType="status"
        versions={mockVersions}
        selectedVersion={null}
        onVersionChange={vi.fn()}
      />
    );

    expect(screen.getByText(/No published versions available/)).toBeInTheDocument();
  });

  it('renders select with versions for catalog type', () => {
    render(
      <VersionPicker
        catalogType="class"
        versions={mockVersions}
        selectedVersion={null}
        onVersionChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/Classes Version/)).toBeInTheDocument();
  });

  it('calls onVersionChange when version is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <VersionPicker
        catalogType="class"
        versions={mockVersions}
        selectedVersion={null}
        onVersionChange={handleChange}
      />
    );

    const select = screen.getByRole('combobox');
    await user.click(select);
    
    const option = screen.getByRole('option', { name: /v2/ });
    await user.click(option);

    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('shows selected version', () => {
    render(
      <VersionPicker
        catalogType="class"
        versions={mockVersions}
        selectedVersion={2}
        onVersionChange={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('v2');
  });
});
