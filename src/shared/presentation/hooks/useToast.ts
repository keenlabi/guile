import { useContext } from 'react';
import { ToastContext } from '../context/ToastContextDefinition';
import { parseError } from '../helpers/error.helper';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  // Updated to accept unknown and parse it automatically
  const showError = (error: unknown, title?: string) => {
    const message = parseError(error);
    context.showError(message, title);
  };

  return {
    ...context,
    showError,
  };
}