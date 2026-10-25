import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '../../test/test-utils';
import {
  ADMIN_FORBIDDEN_PUBLISH_MESSAGE,
  BAD_REQUEST_PUBLISH_MESSAGE,
  PublishDialog,
} from './PublishDialog';
import { AdminForbiddenError, ApiError } from '../../lib/errors';
import { mockClassData, publishDialogDefaultProps } from '../../test/publishDialogTestUtils';

describe('PublishDialog', () => {
  const defaultProps = publishDialogDefaultProps();

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

    expect(screen.getByText(/this version already exists/i)).toBeInTheDocument();
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
  it('displays a distinct admin message for 403 forbidden errors', () => {
    render(
      <PublishDialog
        {...defaultProps}
        error={new AdminForbiddenError('Admin only')}
        isForbiddenError
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(ADMIN_FORBIDDEN_PUBLISH_MESSAGE);
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });
  it('displays a clear message when the server rejects a 400 publish', () => {
    render(
      <PublishDialog
        {...defaultProps}
        error={new ApiError('Catalog data is required', 400)}
        isBadRequestError
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(BAD_REQUEST_PUBLISH_MESSAGE);
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
  it('disables publish when entry ids are invalid', () => {
    const modifiedData = mockClassData.map((c) => ({
      ...c,
      displayName: 'Modified Vanguard',
    }));

    render(
      <PublishDialog {...defaultProps} draftData={modifiedData} hasValidationErrors />,
    );

    expect(screen.getByText(/resolve validation errors before publishing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /review & publish/i })).toBeDisabled();
  });
});
