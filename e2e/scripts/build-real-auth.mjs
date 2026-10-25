import { spawn } from 'node:child_process';

const firebaseEnvMap = {
  E2E_FIREBASE_API_KEY: 'VITE_FIREBASE_API_KEY',
  E2E_FIREBASE_AUTH_DOMAIN: 'VITE_FIREBASE_AUTH_DOMAIN',
  E2E_FIREBASE_PROJECT_ID: 'VITE_FIREBASE_PROJECT_ID',
  E2E_FIREBASE_APP_ID: 'VITE_FIREBASE_APP_ID',
  E2E_FIREBASE_STORAGE_BUCKET: 'VITE_FIREBASE_STORAGE_BUCKET',
  E2E_FIREBASE_MESSAGING_SENDER_ID: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
};

for (const [source, target] of Object.entries(firebaseEnvMap)) {
  const value = process.env[source]?.trim();
  if (value) {
    process.env[target] = value;
  }
}

const child = spawn('npx', ['vite', 'build', '--mode', 'e2e'], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
