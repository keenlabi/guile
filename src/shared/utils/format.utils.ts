/**
 * Standard USD Formatter (e.g., $1,234.56)
 * Used for balances, PnL, and prices.
 */
export const formatCurrency = (amount: number | string, showSymbol = true): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '---';

  return new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Crypto Formatter (e.g., 0.004532 BTC)
 * Uses up to 6 decimal places, but removes trailing zeros.
 */
export const formatCrypto = (amount: number | string, symbol?: string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '---';

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6, // Higher precision for crypto
  }).format(num);

  return symbol ? `${formatted} ${symbol}` : formatted;
};

/**
 * Percentage Formatter (e.g., +12.50%)
 * Automatically adds the +/- sign for positive/negative numbers.
 */
export const formatPct = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.00%';

  const formatted = num.toFixed(2) + '%';
  return num > 0 ? `+${formatted}` : formatted;
};