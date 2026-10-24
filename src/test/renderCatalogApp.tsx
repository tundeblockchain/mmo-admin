import { createMemoryRouter, Navigate, Route, RouterProvider, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { CATALOG_DEFAULT_PATH } from '../lib/catalogRoutes';
import { CatalogPage } from '../pages/Catalog/CatalogPage';
import { render, screen } from './test-utils';

const catalogAppChildren = [
  { path: 'catalog', element: <Navigate to="classes" replace /> },
  { path: 'catalog/:catalogSection', element: <CatalogPage /> },
];

export function renderCatalogApp(initialPath = CATALOG_DEFAULT_PATH) {
  return render(
    <Routes>
      <Route path="/" element={<Layout />}>
        {catalogAppChildren.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>,
    { initialEntries: [initialPath] },
  );
}

export function renderCatalogRouter(initialEntries: string[] = [CATALOG_DEFAULT_PATH]) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: catalogAppChildren,
      },
    ],
    { initialEntries },
  );

  const view = render(<RouterProvider router={router} />, { withMemoryRouter: false });
  return { router, ...view };
}

export async function clickCatalogNav(
  user: { click: (element: HTMLElement) => Promise<void> },
  name: string,
) {
  await user.click(screen.getByRole('link', { name }));
}
