/**
 * Formats a date string into a readable specific format
 * Output: "Jan 07, 14:30:00"
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Change to true for AM/PM
  }).format(date);
};

/**
 * Extracts just the time
 * Output: "14:30:00"
 */
export const formatTime = (dateString: string): string => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

/**
 * Calculates duration between two ISO strings
 * Output: "60s" or "5m" or "1.5h"
 */
export const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return '---';
  
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  
  // Handle edge case where server clocks might slightly drift
  if (endTime <= startTime) return '0s';

  const diffSeconds = Math.floor((endTime - startTime) / 1000);
  
  if (diffSeconds < 60) return `${diffSeconds}s`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
  return `${(diffSeconds / 3600).toFixed(1)}h`;
};