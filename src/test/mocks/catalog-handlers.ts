import { http, HttpResponse } from 'msw';
import {
  mockClassCatalog,
  mockCombatConstantsCatalog,
  mockElementCatalog,
  mockLatestVersions,
  mockResonanceCatalog,
  mockSkillCatalog,
  mockStatusCatalog,
  mockVersionList,
} from './catalog-fixtures';

export {
  mockClassCatalog,
  mockCombatConstantsCatalog,
  mockElementCatalog,
  mockLatestVersions,
  mockResonanceCatalog,
  mockSkillCatalog,
  mockStatusCatalog,
  mockVersionList,
} from './catalog-fixtures';

export interface PublishedCatalogResponse {
  catalogType: string;
  version: number;
  status: 'published';
  createdAt: string;
  publishedAt: string;
  createdBy: string;
  releaseNotes?: string;
}

let nextVersions: Record<string, number> = {
  class: 3,
  skill: 2,
  'combat-constants': 2,
  status: 2,
  element: 2,
  resonance: 2,
};

export function resetMockVersionCounters(): void {
  nextVersions = {
    class: 3,
    skill: 2,
    'combat-constants': 2,
    status: 2,
    element: 2,
    resonance: 2,
  };
}

export const catalogHandlers = [
  http.get('*/catalog/versions', () => {
    return HttpResponse.json(mockVersionList);
  }),

  http.get('*/catalog/versions/latest', () => {
    return HttpResponse.json(mockLatestVersions);
  }),

  http.get('*/catalog/class/v/:version', () => {
    return HttpResponse.json(mockClassCatalog);
  }),

  http.get('*/catalog/skill/v/:version', () => {
    return HttpResponse.json(mockSkillCatalog);
  }),

  http.get('*/catalog/status/v/:version', () => {
    return HttpResponse.json(mockStatusCatalog);
  }),

  http.get('*/catalog/element/v/:version', () => {
    return HttpResponse.json(mockElementCatalog);
  }),

  http.get('*/catalog/resonance/v/:version', () => {
    return HttpResponse.json(mockResonanceCatalog);
  }),

  http.get('*/catalog/combat-constants/v/:version', () => {
    return HttpResponse.json(mockCombatConstantsCatalog);
  }),

  http.post('*/catalog/:catalogType/versions', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Valid Firebase ID token required' },
        { status: 401 },
      );
    }

    const catalogType = params.catalogType as string;
    const body = (await request.json()) as { data: unknown; releaseNotes?: string };

    if (!body.data) {
      return HttpResponse.json(
        { error: 'Catalog data is required' },
        { status: 400 },
      );
    }

    const version = nextVersions[catalogType] ?? 1;
    nextVersions[catalogType] = version + 1;

    const response: PublishedCatalogResponse = {
      catalogType,
      version,
      status: 'published',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      createdBy: 'test-user-uid',
      releaseNotes: body.releaseNotes,
    };

    return HttpResponse.json(response, { status: 201 });
  }),
];
