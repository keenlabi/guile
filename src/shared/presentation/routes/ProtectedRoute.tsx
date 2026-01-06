import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './routes';

export function ProtectedRoute() {
  const { isAuthenticated, isFetchProfileLoading } = useAuth();
  const location = useLocation();

  // 1. Show spinner while determining auth state (e.g. bootstrapping from cookie)
  if (isFetchProfileLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#F8F9FA' // Use your app background color
      }}>
        {/* Simple spinner, replace with a proper LoadingComponent later */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderLeftColor: '#73D373', // Brand Green
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2. Redirect to Login if not authenticated
  if (!isAuthenticated) {
    // Save the location they were trying to go to so we can redirect them back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}