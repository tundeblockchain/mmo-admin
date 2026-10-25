import { afterEach, describe, expect, it } from 'vitest';
import {
  REAL_AUTH_ENV_NAMES,
  missingRealAuthEnvNames,
  realAuthSkipMessage,
} from './realAuthEnv';

const originalValues = Object.fromEntries(
  REAL_AUTH_ENV_NAMES.map((name) => [name, process.env[name]]),
);

afterEach(() => {
  for (const name of REAL_AUTH_ENV_NAMES) {
    const original = originalValues[name];
    if (original === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = original;
    }
  }
});

describe('missingRealAuthEnvNames', () => {
  it('lists every required name when none are set', () => {
    for (const name of REAL_AUTH_ENV_NAMES) {
      delete process.env[name];
    }

    expect(missingRealAuthEnvNames()).toEqual([...REAL_AUTH_ENV_NAMES]);
  });

  it('treats empty strings as missing', () => {
    for (const name of REAL_AUTH_ENV_NAMES) {
      process.env[name] = '';
    }

    expect(missingRealAuthEnvNames()).toEqual([...REAL_AUTH_ENV_NAMES]);
  });

  it('returns an empty list when all required values are present', () => {
    for (const name of REAL_AUTH_ENV_NAMES) {
      process.env[name] = 'set';
    }

    expect(missingRealAuthEnvNames()).toEqual([]);
  });

  it('names only the unset variables', () => {
    for (const name of REAL_AUTH_ENV_NAMES) {
      process.env[name] = 'set';
    }
    delete process.env.E2E_FIREBASE_PROJECT_ID;

    expect(missingRealAuthEnvNames()).toEqual(['E2E_FIREBASE_PROJECT_ID']);
  });
});

describe('realAuthSkipMessage', () => {
  it('lists missing variable names without values', () => {
    const message = realAuthSkipMessage([
      'E2E_TEST_EMAIL',
      'E2E_FIREBASE_API_KEY',
    ]);

    expect(message).toBe(
      'Skipping real sign-in: required environment variables are not set (E2E_TEST_EMAIL, E2E_FIREBASE_API_KEY)',
    );
  });
});
