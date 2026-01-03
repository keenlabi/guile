import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { RegistrationPage } from '../../../modules/auth/presentation/pages/Registration/RegistrationPage';
import { AuthProvider } from '../context/AuthProvider';
import { LoginPage } from '../../../modules/auth/presentation/pages/LoginPage/LoginPage';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { ROUTES } from './routes';

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage />, index: true },
      { path: ROUTES.SIGNUP, element: <RegistrationPage /> },
    ]
  },
  
  // --- Protected App Routes ---
  {
    element: <ProtectedRoute />, // 1. Check Auth & Profile Status
    children: [
      { 
        element: <AppLayout />, // 2. If OK, render Layout (Sidebar + Header)
        children: [
          // { path: ROUTES.COMMUNITIES, element: <CommunityFeedPage /> },
          // { path: ROUTES.OVERVIEW, element: < /> },
        ]
      }
    ]
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> }
]);

export function AppRouter() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}