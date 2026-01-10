import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { RegistrationPage } from '../../../modules/auth/presentation/pages/Registration/RegistrationPage';
import { AuthProvider } from '../context/AuthProvider';
import { LoginPage } from '../../../modules/auth/presentation/pages/LoginPage/LoginPage';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { ROUTES } from './routes';
import { WalletPage } from 'src/modules/wallet/presentation/pages/WalletPage/WalletPage';
import { TradersListPage } from 'src/modules/admin/presentation/pages/Traders/TradersListPage/TradersListPage';
import { TraderProfileLayout } from 'src/modules/admin/presentation/layouts/TraderProfileLayout/TraderProfileLayout';
import { TraderWalletsPage } from 'src/modules/admin/presentation/pages/Traders/TradersWalletPage/TraderWalletPage';
import { MarketPage } from 'src/modules/market/presentation/pages/MarketPage/MarketPage';
import { AdminPredictionList } from 'src/modules/prediction/presentation/components/AdminPredictionList/AdminPredictionList';

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
    element: <ProtectedRoute />,
    children: [
      { path: ROUTES.MARKET, element: <MarketPage /> },
      { 
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.MARKET} replace /> },
          { path: ROUTES.OVERVIEW, element: <Navigate to={ROUTES.MARKET} replace /> }, 
          { path: ROUTES.WALLET, element: <WalletPage /> },
          // { path: ROUTES.TRADE, element: <TradePage /> },
          // --- Admin Routes ---
          { 
            path: ROUTES.ADMIN_TRADERS, 
            element: <TradersListPage /> 
          },
          {
            path: ROUTES.ADMIN_TRADER_DETAIL,
            element: <TraderProfileLayout />, // Acts as the layout for the specific trader
            children: [
              // Default view for a trader is their wallet
              { index: true, element: <Navigate to="wallets" replace /> },
              { path: 'wallets', element: <TraderWalletsPage /> },
              { path: 'overview', element: <div>Trader Overview (Coming Soon)</div> },
              { path: 'activity', element: <div>Trader Activity (Coming Soon)</div> },
            ]
          },
          {
            path: ROUTES.ADMIN_PREDICTION_LIST,
            element: <AdminPredictionList />,
          }
        ]
      },
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