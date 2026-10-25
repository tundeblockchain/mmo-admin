import { describe, expect, it } from 'vitest';
import {
  normalizeCatalogVersionList,
  normalizeLatestVersions,
} from './catalogVersionResponses';

describe('normalizeCatalogVersionList', () => {
  it('accepts an empty array as an empty catalog', () => {
    expect(normalizeCatalogVersionList([])).toEqual({ versions: [] });
  });

  it('accepts the wrapped versions object', () => {
    const versions = [
      { catalogType: 'class', version: 1, status: 'published', publishedAt: '2024-01-01T00:00:00.000Z' },
    ];
    expect(normalizeCatalogVersionList({ versions })).toEqual({ versions });
  });
});

describe('normalizeLatestVersions', () => {
  it('treats a missing latest map as empty', () => {
    expect(normalizeLatestVersions({ versions: {} })).toEqual({
      versions: {},
      timestamp: '',
    });
  });

  it('keeps published latest versions', () => {
    expect(
      normalizeLatestVersions({
        versions: { class: 2 },
        timestamp: '2024-06-15T10:30:00.000Z',
      }),
    ).toEqual({
      versions: { class: 2 },
      timestamp: '2024-06-15T10:30:00.000Z',
    });
  });
});
