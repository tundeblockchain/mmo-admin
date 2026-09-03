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

## Testing

Tests use [Vitest](https://vitest.dev/) with React Testing Library:

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm test -- --run
```

## Environment Variables

Create a `.env.local` file for local development (this file is gitignored):

```env
# API base URL (optional, defaults to empty string)
VITE_API_BASE_URL=https://your-api-url.example.com
```

### Required Environment Variables for Deployment

Configure these in your deployment platform (e.g., Netlify):

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the backend API |

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
