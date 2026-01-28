export const ROUTES = {
  // Public
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Authenticated
  DASHBOARD: '/dashboard',
  OVERVIEW: '/dashboard/overview',
  
  MARKET: '/market',      // Price charts
  TRADE: '/trade',        // The trading terminal
  WALLET: '/wallet', // Balances
  PROFILE: '/profile',
  KYC: '/kyc',

  ADMIN_TRADERS: '/admin/traders',
  ADMIN_TRADER_DETAIL: '/admin/traders/:id',
  ADMIN_PREDICTION_LIST: '/admin/prediction/list',
  ADMIN_WITHDRAWALS: '/admin/withdrawals',
  ADMIN_KYC: '/admin/kyc',
};