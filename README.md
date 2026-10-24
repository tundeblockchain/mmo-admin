# MMO Admin Control Panel

Admin control panel for the MMO project built with React, TypeScript, and Material UI.

## Prerequisites

- Node.js 22+
- npm

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests in watch mode |
| `npm test -- --run` | Run tests once |
| `npm run build:e2e` | Production build with placeholder Firebase config and the E2E auth stub enabled |
| `npm run build:e2e:real` | E2E build that overlays a real Firebase test project from `E2E_FIREBASE_*` |
| `npm run test:e2e` | Run mocked Playwright specs (placeholder Firebase) |
| `npm run test:e2e:real` | Run the opt-in real Firebase sign-in spec |
| `npm run test:e2e:ui` | Open the Playwright UI runner for mocked specs |

## Testing

Tests use [Vitest](https://vitest.dev/) with React Testing Library:

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm test -- --run
```

### End-to-end tests

Playwright covers sign-in, catalog browsing, draft editing, draft persistence, and publish gating. Mocked specs stub Firebase auth and intercept backend API calls with `page.route`, so they do not need a live API or Firebase project.

```bash
# Install the Chromium browser used by Playwright (once per machine)
npx playwright install --with-deps chromium

# Build the E2E bundle and run the suite
npm run test:e2e
```

`npm run test:e2e` starts a preview server automatically. Locally it builds with `vite build --mode e2e` first (dummy Firebase config from `.env.e2e`, `VITE_E2E=true`, `VITE_API_BASE_URL=https://e2e-api.example.com`). The E2E auth stub is compiled only when `VITE_E2E=true` and is inert in production builds. GitHub Actions runs the mocked suite on every pull request and on pushes to `main`. The HTML report is uploaded as the `playwright-report` artifact; failure screenshots and traces are uploaded as `test-results`.

#### Real Firebase sign-in (opt-in)

`e2e/specs/real-signin.spec.ts` calls Firebase `signInWithEmailAndPassword` through an E2E-only test harness against a **real Firebase test project**. It never uses Google sign-in and never shows a password form in the production UI. The mocked suite keeps the placeholder Firebase values in `.env.e2e`. The real spec is a separate Playwright project (`real-auth`) and a separate CI step.

Set all of the following in the environment (or as GitHub Actions repository secrets). Do not log the values:

```env
E2E_TEST_EMAIL=admin@example.com
E2E_TEST_PASSWORD=your-test-password
E2E_FIREBASE_API_KEY=your-test-project-api-key
E2E_FIREBASE_AUTH_DOMAIN=your-test-project.firebaseapp.com
E2E_FIREBASE_PROJECT_ID=your-test-project-id
E2E_FIREBASE_APP_ID=1:000000000000:web:abcdef
```

Optional, used only when the real-auth bundle is built:

```env
E2E_FIREBASE_STORAGE_BUCKET=your-test-project.appspot.com
E2E_FIREBASE_MESSAGING_SENDER_ID=000000000000
```

If any required value is unset, the spec and the CI step skip with a message that lists the **names** of the missing variables — never their values. Do not commit credentials.

```bash
# Build with the real Firebase test project and run only the real sign-in spec
npm run test:e2e:real
```

## Environment Variables

Create a `.env.local` file for local development (this file is gitignored):

```env
# API base URL (optional, defaults to empty string)
VITE_API_BASE_URL=https://your-api-url.example.com

# Firebase Configuration (required for authentication)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Required Environment Variables for Deployment

Configure these in your deployment platform (e.g., Netlify):

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the backend API |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain (e.g., `project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket (e.g., `project.appspot.com`) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google sign-in under Authentication > Sign-in method
3. Add your domain to the authorized domains list
4. Copy the Firebase config values from Project Settings > General > Your apps

**Important:** These are public client-side configuration values (not secrets). The Firebase API key only identifies your project and is safe to include in client-side code. Never commit `.env` files, service account keys, or Firebase Admin SDK credentials to the repository.

## Authentication

This application uses Firebase Authentication with Google sign-in. All admin routes are protected and require authentication.

### Getting ID Tokens for API Calls

After authentication, you can obtain a JWT ID token for API authorization:

```typescript
import { getIdToken } from './auth';

async function makeApiCall() {
  const token = await getIdToken();
  if (token) {
    const response = await fetch('/api/endpoint', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
```

**Note:** All `VITE_` prefixed variables are exposed to the client. Do not store secrets or private keys in these variables.

## Deployment

### Netlify

This project includes a `netlify.toml` configuration file for Netlify deployment:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA routing:** All routes redirect to `index.html`

To deploy:

1. Connect your repository to Netlify
2. Configure environment variables in Netlify dashboard
3. Deploy

The `netlify.toml` handles SPA routing automatically.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Layout/       # App shell layout (AppBar, Drawer)
├── config/           # Configuration and environment
├── pages/            # Page components
│   ├── Home/
│   └── Catalog/
├── test/             # Test utilities and setup
├── App.tsx           # Root component
├── main.tsx          # Entry point
├── router.tsx        # Route definitions
└── theme.ts          # MUI theme configuration
```

## Tech Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Material UI (MUI)](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
