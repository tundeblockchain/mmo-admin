import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import { PublishDialog } from './PublishDialog';
import type { ClassDefinition } from '../../types/catalog';

const mockClassData: ClassDefinition[] = [
  {
    classId: 'vanguard',
    displayName: 'Vanguard',
    description: 'A stalwart frontline defender.',
    primaryResource: 'resolve',
    startingStats: {
      strength: 12,
      finesse: 7,
      vitality: 12,
      intellect: 4,
      precision: 6,
      luck: 5,
      tech: 4,
      hp: 150,
      resourcePool: 100,
      armor: 20,
      attackPower: 26,
      spellPower: 9,
      movementSpeed: 5.0,
    },
    resonance: 'valor',
    roles: ['tank', 'dps'],
  },
];

describe('PublishDialog', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onPublish: vi.fn(),
    catalogType: 'class' as const,
    sourceVersion: 1,
    originalData: mockClassData,
    draftData: mockClassData,
    isPending: false,
    error: null,
    isConflictError: false,
    isAuthError: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog with catalog type and source version', () => {
    render(<PublishDialog {...defaultProps} />);

    expect(screen.getByRole('heading', { name: /publish class catalog/i })).toBeInTheDocument();
    expect(screen.getByText(/version 1/i)).toBeInTheDocument();
  });

  it('shows no changes message when data is unchanged', () => {
    render(<PublishDialog {...defaultProps} />);

    expect(screen.getByText(/no changes detected/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /review & publish/i })).toBeDisabled();
  });

  it('shows change summary when data is modified', () => {
    const modifiedData = mockClassData.map((c) => ({
      ...c,
      displayName: 'Modified Vanguard',
    }));

    render(<PublishDialog {...defaultProps} draftData={modifiedData} />);

    expect(screen.getByText('Modified')).toBeInTheDocument();
    expect(screen.getByText('1 entities')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /review & publish/i })).toBeEnabled();
  });

  it('shows confirmation dialog before publishing', async () => {
    const user = userEvent.setup();
    const modifiedData = mockClassData.map((c) => ({
      ...c,
      displayName: 'Modified Vanguard',
    }));

    render(<PublishDialog {...defaultProps} draftData={modifiedData} />);

    await user.click(screen.getByRole('button', { name: /review & publish/i }));

    expect(screen.getByText(/are you sure you want to publish/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm publish/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('calls onPublish with release notes when confirmed', async () => {
    const user = userEvent.setup();
    const onPublish = vi.fn().mockResolvedValue(undefined);
    const modifiedData = mockClassData.map((c) => ({
      ...c,
      displayName: 'Modified Vanguard',
    }));

    render(
      <PublishDialog {...defaultProps} draftData={modifiedData} onPublish={onPublish} />,
    );

    await user.type(
      screen.getByRole('textbox', { name: /release notes/i }),
      'Test release notes',
    );
    await user.click(screen.getByRole('button', { name: /review & publish/i }));
    await user.click(screen.getByRole('button', { name: /confirm publish/i }));

    expect(onPublish).toHaveBeenCalledWith('Test release notes');
  });

  it('displays 409 conflict error message', () => {
    render(
      <PublishDialog
        {...defaultProps}
        error={new Error('Version conflict')}
        isConflictError
      />,
    );

    expect(screen.getByText(/version conflict/i)).toBeInTheDocument();
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it('displays 401 auth error message', () => {
    render(
      <PublishDialog
        {...defaultProps}
        error={new Error('Authentication required')}
        isAuthError
      />,
    );

    expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('disables buttons when pending', () => {
    const modifiedData = mockClassData.map((c) => ({
      ...c,
      displayName: 'Modified Vanguard',
    }));

    render(<PublishDialog {...defaultProps} draftData={modifiedData} isPending />);

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /review & publish/i })).toBeDisabled();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<PublishDialog {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('can go back from confirmation', async () => {
    const user = userEvent.setup();
    const modifiedData = mockClassData.map((c) => ({
      ...c,
      displayName: 'Modified Vanguard',
    }));

    render(<PublishDialog {...defaultProps} draftData={modifiedData} />);

    await user.click(screen.getByRole('button', { name: /review & publish/i }));
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /go back/i }));
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
  });

  it('shows added entities count', () => {
    const dataWithAddition: ClassDefinition[] = [
      ...mockClassData,
      {
        classId: 'ranger',
        displayName: 'Ranger',
        description: 'A precise marksman.',
        primaryResource: 'focus',
        startingStats: {
          strength: 6,
          finesse: 11,
          vitality: 6,
          intellect: 4,
          precision: 13,
          luck: 7,
          tech: 3,
          hp: 100,
          resourcePool: 100,
          armor: 8,
          attackPower: 14,
          spellPower: 9,
          movementSpeed: 5.5,
        },
        resonance: 'precision',
        roles: ['dps'],
      },
    ];

    render(<PublishDialog {...defaultProps} draftData={dataWithAddition} />);

    expect(screen.getByText('Added')).toBeInTheDocument();
  });

  it('shows removed entities count', () => {
    render(<PublishDialog {...defaultProps} draftData={[]} />);

    expect(screen.getByText('Removed')).toBeInTheDocument();
    expect(screen.getByText('1 entities')).toBeInTheDocument();
  });
});
