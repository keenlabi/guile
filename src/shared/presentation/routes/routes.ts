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
  SETTINGS: '/settings',

  ADMIN_TRADERS: '/admin/traders',
  ADMIN_TRADER_DETAIL: '/admin/traders/:id',
  ADMIN_PREDICTION_LIST: '/admin/prediction/list'
};