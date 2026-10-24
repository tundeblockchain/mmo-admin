import { describe, expect, it } from 'vitest';
import { draftNoticeFlags } from './useCatalogWorkspaceUi';

describe('draftNoticeFlags', () => {
  it('hides notices when there is no draft', () => {
    expect(
      draftNoticeFlags({
        draft: null,
        latestVersion: 2,
        dismissedRestoreNoticeId: null,
        dismissedStaleWarningId: null,
      }),
    ).toEqual({
      draftIdentity: null,
      showRestoreNotice: false,
      showStaleBaseWarning: false,
    });
  });

  it('shows restore and stale notices until they are dismissed', () => {
    const draft = { catalogType: 'class' as const, sourceVersion: 1, wasRestored: true };

    expect(
      draftNoticeFlags({
        draft,
        latestVersion: 2,
        dismissedRestoreNoticeId: null,
        dismissedStaleWarningId: null,
      }),
    ).toEqual({
      draftIdentity: 'class:1',
      showRestoreNotice: true,
      showStaleBaseWarning: true,
    });

    expect(
      draftNoticeFlags({
        draft,
        latestVersion: 2,
        dismissedRestoreNoticeId: 'class:1',
        dismissedStaleWarningId: 'class:1',
      }),
    ).toEqual({
      draftIdentity: 'class:1',
      showRestoreNotice: false,
      showStaleBaseWarning: false,
    });
  });
});
