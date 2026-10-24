import { describe, expect, it } from 'vitest';
import { latestPublishedVersion } from './catalogVersions';
import type { CatalogVersionSummary } from '../types/catalog';

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
