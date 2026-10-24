import type { Page, Route } from '@playwright/test';
import {
  mockClassCatalog,
  mockCombatConstantsCatalog,
  mockElementCatalog,
  mockResonanceCatalog,
  mockSkillCatalog,
  mockStatusCatalog,
  mockVersionList,
} from '../../src/test/mocks/catalog-handlers';

export const E2E_API_ORIGIN = 'https://e2e-api.example.com';

export {
  mockClassCatalog,
  mockCombatConstantsCatalog,
  mockElementCatalog,
  mockResonanceCatalog,
  mockSkillCatalog,
  mockStatusCatalog,
  mockVersionList,
};

export interface CatalogRouteOptions {
  publishStatus?: 201 | 400 | 401 | 403;
  accountType?: 'admin' | 'player';
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

function accountTypeFromAuthorization(
  authorization: string,
  fallback: 'admin' | 'player',
): 'admin' | 'player' {
  if (authorization === 'Bearer e2e-player-token') {
    return 'player';
  }
  if (authorization.startsWith('Bearer ')) {
    return fallback;
  }
  return fallback;
}

export async function installCatalogRoutes(
  page: Page,
  options: CatalogRouteOptions = {},
): Promise<void> {
  const publishStatus = options.publishStatus ?? 201;
  const defaultAccountType = options.accountType ?? 'admin';

  await page.route((url) => url.origin === E2E_API_ORIGIN, async (route) => {
    const request = route.request();
    const method = request.method();
    const url = new URL(request.url());
    const path = url.pathname;
    const authorization = request.headers().authorization ?? '';

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: CORS_HEADERS });
      return;
    }

    if (method === 'POST' && path === '/users/me') {
      if (!authorization.startsWith('Bearer ')) {
        await json(route, 401, { error: 'Valid Firebase ID token required' });
        return;
      }

      await json(route, 200, {
        uid: accountTypeFromAuthorization(authorization, defaultAccountType) === 'player'
          ? 'e2e-player-uid'
          : 'e2e-admin-uid',
        accountType: accountTypeFromAuthorization(authorization, defaultAccountType),
      });
      return;
    }

    if (method === 'GET' && path === '/catalog/versions') {
      await json(route, 200, mockVersionList);
      return;
    }

    if (method === 'GET' && /^\/catalog\/class\/v\/\d+$/.test(path)) {
      await json(route, 200, mockClassCatalog);
      return;
    }

    if (method === 'GET' && /^\/catalog\/skill\/v\/\d+$/.test(path)) {
      await json(route, 200, mockSkillCatalog);
      return;
    }

    if (method === 'GET' && /^\/catalog\/status\/v\/\d+$/.test(path)) {
      await json(route, 200, mockStatusCatalog);
      return;
    }

    if (method === 'GET' && /^\/catalog\/element\/v\/\d+$/.test(path)) {
      await json(route, 200, mockElementCatalog);
      return;
    }

    if (method === 'GET' && /^\/catalog\/resonance\/v\/\d+$/.test(path)) {
      await json(route, 200, mockResonanceCatalog);
      return;
    }

    if (method === 'GET' && /^\/catalog\/combat-constants\/v\/\d+$/.test(path)) {
      await json(route, 200, mockCombatConstantsCatalog);
      return;
    }

    if (method === 'POST' && /^\/catalog\/[^/]+\/versions$/.test(path)) {
      if (!authorization.startsWith('Bearer ')) {
        await json(route, 401, { error: 'Valid Firebase ID token required' });
        return;
      }

      if (authorization === 'Bearer e2e-player-token') {
        await json(route, 403, { error: 'Admin only' });
        return;
      }

      if (authorization === 'Bearer e2e-expired-token' || publishStatus === 401) {
        await json(route, 401, { error: 'Authentication required' });
        return;
      }

      if (publishStatus === 403) {
        await json(route, 403, { error: 'Admin only' });
        return;
      }

      let body: { data?: unknown } = {};
      try {
        body = (request.postDataJSON() as { data?: unknown }) ?? {};
      } catch {
        body = {};
      }

      if (publishStatus === 400 || (Array.isArray(body.data) && body.data.length === 0)) {
        await json(route, 400, { error: 'Catalog data must not be an empty array' });
        return;
      }

      const catalogType = path.match(/^\/catalog\/([^/]+)\/versions$/)?.[1] ?? 'class';
      await json(route, 201, {
        catalogType,
        version: 3,
        status: 'published',
        createdAt: '2024-06-20T00:00:00.000Z',
        publishedAt: '2024-06-20T00:00:00.000Z',
        createdBy: 'e2e-admin-uid',
      });
      return;
    }

    await route.fulfill({
      status: 404,
      headers: CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify({ error: `Unhandled E2E route ${method} ${path}` }),
    });
  });
}
