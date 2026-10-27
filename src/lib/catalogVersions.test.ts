import { describe, expect, it } from 'vitest';
import {
  isPublishedVersion,
  latestPublishedVersion,
  latestVersionFromMap,
  publishedVersionOrNull,
  resolvePublishedVersion,
} from './catalogVersions';
import type { CatalogVersionSummary, LatestVersions } from '../types/catalog';

const versions: CatalogVersionSummary[] = [
  { catalogType: 'class', version: 2, status: 'published', publishedAt: '2024-06-15T10:30:00.000Z' },
  { catalogType: 'class', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
  { catalogType: 'skill', version: 1, status: 'published', publishedAt: '2024-06-01T00:00:00.000Z' },
];

describe('latestPublishedVersion', () => {
  it.each([
    ['class', 2],
    ['skill', 1],
    ['status', null],
  ] as const)('returns the latest published version for %s', (catalogType, expected) => {
    expect(latestPublishedVersion(versions, catalogType)).toBe(expected);
  });
});

describe('unpublished version helpers', () => {
  it('treats missing latest keys as empty', () => {
    const latest: LatestVersions = { versions: {}, timestamp: '' };

    expect(latestVersionFromMap(latest, 'class')).toBeNull();
    expect(isPublishedVersion(0)).toBe(false);
    expect(publishedVersionOrNull(0)).toBeNull();
    expect(publishedVersionOrNull(2)).toBe(2);
  });
});

describe('resolvePublishedVersion', () => {
  const latest: LatestVersions = { versions: { class: 2, skill: 1 }, timestamp: '' };

  it('prefers an explicit override over the latest published version', () => {
    expect(resolvePublishedVersion(1, versions, latest, 'class')).toBe(1);
  });

  it('defaults to the latest list entry, then the latest-versions map', () => {
    expect(resolvePublishedVersion(null, versions, latest, 'class')).toBe(2);
    expect(resolvePublishedVersion(null, [], latest, 'class')).toBe(2);
    expect(resolvePublishedVersion(null, [], latest, 'status')).toBeNull();
  });
});
