import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { HomePage } from './pages/Home/HomePage';
import { CatalogPage } from './pages/Catalog/CatalogPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
    ],
  },
]);
