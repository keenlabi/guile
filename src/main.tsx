import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRouter } from './shared/presentation/routes/AppRouter';
import "src/shared/presentation/styles/index.css";
import { ToastProvider } from './shared/presentation/context/ToastContext';
import { QueryProvider } from './shared/presentation/context/QueryProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </QueryProvider>
  </StrictMode>,
)
