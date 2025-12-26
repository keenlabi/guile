import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { RegistrationPage } from '../../../features/auth/presentation/pages/Registration/RegistrationPage';
import { AuthProvider } from '../context/AuthProvider';
import { CallbackPage } from '../../../features/auth/presentation/pages/Callback';
import { LoginPage } from '../../../features/auth/presentation/pages/LoginPage/LoginPage';
import { SeekerOnboardingPage } from '../../../features/onboarding/presentation/pages/SeekerOnboardingPage/SeekerOnboardingPage';
import { ChoosePathPage } from '../../../features/onboarding/presentation/pages/ChoosePath/ChoosePathPage';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { CommunityFeedPage } from '../../../features/community/presentation/pages/CommunityFeedPage/CommunityFeedPage';
import { ROUTES } from './routes';
import CreateCommunityPage from '../../../features/community/presentation/pages/CreateCommunityPage/CreateCommunityPage';

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage />, index: true },
      { path: ROUTES.SIGNUP, element: <RegistrationPage /> },
    ]
  },

  { path: ROUTES.CHOOSE_PATH, element: <ChoosePathPage /> },
  { path: ROUTES.ONBOARDING_SEEKER, element: <SeekerOnboardingPage /> },
  { path: ROUTES.AUTH_CALLBACK, element: <CallbackPage /> },
  
  // --- Protected App Routes ---
  {
    element: <ProtectedRoute />, // 1. Check Auth & Profile Status
    children: [
      { 
        element: <AppLayout />, // 2. If OK, render Layout (Sidebar + Header)
        children: [
          { path: ROUTES.COMMUNITIES, element: <CommunityFeedPage /> },
          { path: ROUTES.CREATE_COMMUNITY, element: <CreateCommunityPage /> }
          // { path: '/jobs', element: <JobsPage /> },
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