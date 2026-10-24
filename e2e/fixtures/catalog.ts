import type { Page, Route } from '@playwright/test';

export const mockVersionList = {
  versions: [
    {
      catalogType: 'class',
      version: 2,
      status: 'published',
      publishedAt: '2024-06-15T10:30:00.000Z',
    },
    {
      catalogType: 'class',
      version: 1,
      status: 'published',
      publishedAt: '2024-06-01T00:00:00.000Z',
    },
    {
      catalogType: 'skill',
      version: 1,
      status: 'published',
      publishedAt: '2024-06-01T00:00:00.000Z',
    },
    {
      catalogType: 'combat-constants',
      version: 1,
      status: 'published',
      publishedAt: '2024-06-01T00:00:00.000Z',
    },
    {
      catalogType: 'status',
      version: 1,
      status: 'published',
      publishedAt: '2024-06-01T00:00:00.000Z',
    },
    {
      catalogType: 'element',
      version: 1,
      status: 'published',
      publishedAt: '2024-06-01T00:00:00.000Z',
    },
    {
      catalogType: 'resonance',
      version: 1,
      status: 'published',
      publishedAt: '2024-06-01T00:00:00.000Z',
    },
  ],
};

export const mockClassCatalog = {
  catalogType: 'class',
  version: 2,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  publishedAt: '2024-06-15T10:30:00.000Z',
  createdBy: 'catalog-seed',
  data: [
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
  ],
};

export const mockSkillCatalog = {
  catalogType: 'skill',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'catalog-seed',
  data: [
    {
      skillId: 'vanguard_cleaving_strike',
      classId: 'vanguard',
      displayName: 'Cleaving Strike',
      description: '1.50 P + 0.60 STR, 120° arc.',
      kind: 'active',
      resourceId: null,
      resourceCost: 0,
      cooldownSeconds: 0,
      charges: 1,
      chargeRechargeSeconds: 0,
      castTimeSeconds: 0,
      castableWhileMoving: false,
      range: 0,
      coefficients: {
        basePower: 1.5,
        scaling: [
          { stat: 'attackPower', coefficient: 1.5 },
          { stat: 'strength', coefficient: 0.6 },
        ],
        element: 'physical',
      },
      timing: { castMs: 0, activeMs: 350, recoveryMs: 300 },
      stagger: { staggerPower: 20, canStagger: true },
      unlockLevel: 1,
      iconPath: 'icons/skills/vanguard/cleaving_strike.png',
    },
  ],
};

export const mockStatusCatalog = {
  catalogType: 'status',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'catalog-seed',
  data: [
    {
      statusId: 'flame',
      displayName: 'Flame',
      description: 'Burning from fire damage.',
      category: 'dot',
      maxStacks: 3,
      dispellable: true,
      persistsThroughDeath: false,
      iconPath: 'icons/statuses/flame.png',
    },
  ],
};

export const mockElementCatalog = {
  catalogType: 'element',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'catalog-seed',
  data: [
    {
      elementId: 'fire',
      displayName: 'Fire',
      color: '#FF4500',
      strongAgainst: { ice: 1.25, nature: 1.25 },
      weakAgainst: { fire: 0.5 },
    },
  ],
};

export const mockResonanceCatalog = {
  catalogType: 'resonance',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'catalog-seed',
  data: [
    {
      resonanceId: 'valor',
      displayName: 'Valor',
      description: 'The resonance of the Vanguard.',
      partyBonus: [
        { stat: 'hp', bonusPercent: 0.1 },
        { stat: 'armor', bonusPercent: 0.08 },
      ],
    },
  ],
};

export const mockCombatConstantsCatalog = {
  catalogType: 'combat-constants',
  version: 1,
  status: 'published',
  createdAt: '2024-06-01T00:00:00.000Z',
  createdBy: 'catalog-seed',
  data: {
    powerScaling: {
      physicalPower: { strengthMultiplier: 2, levelMultiplier: 1.5 },
      spellPower: { intellectMultiplier: 2, levelMultiplier: 1 },
      techPower: { techMultiplier: 2, levelMultiplier: 1 },
      devicePower: { techDivisor: 100 },
    },
    critical: {
      baseCritChance: 0.05,
      critChance: { luckConstant: 500, maxLuckCritBonus: 0.3 },
      procChance: { luckDivisor: 500 },
      criticalDamageMultiplier: 1.5,
    },
    defense: {
      defenseConstant: { baseConstant: 200, levelMultiplier: 15 },
      armorReductionPerPoint: 0.001,
      maxArmorReduction: 0.75,
      blockDamageReduction: 0.5,
    },
  },
};

export interface CatalogRouteOptions {
  publishStatus?: 201 | 400 | 401 | 403;
}

function json(route: Route, status: number, body: unknown) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export async function installCatalogRoutes(
  page: Page,
  options: CatalogRouteOptions = {},
): Promise<void> {
  const publishStatus = options.publishStatus ?? 201;

  await page.route('**/catalog/versions', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }
    await json(route, 200, mockVersionList);
  });

  await page.route('**/catalog/class/v/*', async (route) => {
    await json(route, 200, mockClassCatalog);
  });

  await page.route('**/catalog/skill/v/*', async (route) => {
    await json(route, 200, mockSkillCatalog);
  });

  await page.route('**/catalog/status/v/*', async (route) => {
    await json(route, 200, mockStatusCatalog);
  });

  await page.route('**/catalog/element/v/*', async (route) => {
    await json(route, 200, mockElementCatalog);
  });

  await page.route('**/catalog/resonance/v/*', async (route) => {
    await json(route, 200, mockResonanceCatalog);
  });

  await page.route('**/catalog/combat-constants/v/*', async (route) => {
    await json(route, 200, mockCombatConstantsCatalog);
  });

  await page.route('**/catalog/*/versions', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }

    const authorization = route.request().headers().authorization ?? '';
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
      body = (route.request().postDataJSON() as { data?: unknown }) ?? {};
    } catch {
      body = {};
    }

    if (publishStatus === 400 || (Array.isArray(body.data) && body.data.length === 0)) {
      await json(route, 400, { error: 'Catalog data must not be an empty array' });
      return;
    }

    const catalogType = route.request().url().match(/\/catalog\/([^/]+)\/versions/)?.[1] ?? 'class';
    await json(route, 201, {
      catalogType,
      version: 3,
      status: 'published',
      createdAt: '2024-06-20T00:00:00.000Z',
      publishedAt: '2024-06-20T00:00:00.000Z',
      createdBy: 'e2e-admin-uid',
    });
  });
}
