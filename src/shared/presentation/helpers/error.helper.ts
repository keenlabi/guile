export interface AppError {
  message: string;
  code?: string | number;
}

/**
 * Parses an unknown error into a user-friendly string message.
 * Handles Axios errors, standard Errors, and string messages.
 */
export function parseError(error: unknown, defaultMessage = "An unexpected error occurred."): string {
  if (!error) return defaultMessage;

  // 1. Handle Standard JS Error
  if (error instanceof Error) {
    return error.message;
  }

  // 2. Handle String error
  if (typeof error === 'string') {
    return error;
  }

  // 3. Handle Object with message property (e.g. API Response or custom object)
  const errorObj = error as Record<string, unknown>;
  
  // Check for specific API error structure (e.g. error.response.data.message for Axios)
  // or a direct message property
  if (typeof errorObj.message === 'string') {
    return errorObj.message;
  }

  // If you are using Axios and throwing error.response?.data
  // Ensure your repositories throw the actual data object or a standardized format
  // Example: if repository throws { status: 'ERROR', message: '...' }
  
  return defaultMessage;
}