import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminGate } from './components/account/AdminGate';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { HomePage } from './pages/Home/HomePage';
import { CatalogPage } from './pages/Catalog/CatalogPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminGate>
          <Layout />
        </AdminGate>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'catalog',
        children: [
          {
            index: true,
            element: <Navigate to="classes" replace />,
          },
          {
            path: ':catalogSection',
            element: <CatalogPage />,
          },
        ],
      },
    ],
  },
]);
