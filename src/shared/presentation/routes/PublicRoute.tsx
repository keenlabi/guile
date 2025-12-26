import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PublicRoute() {
  const { isAuthenticated, isFetchProfileLoading } = useAuth();

  // 1. Wait for auth check to complete
  if (isFetchProfileLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#F8F9FA'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderLeftColor: '#73D373', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2. If user is logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/communities" replace />;
  }

  // 3. Otherwise, render the public page (Login/Signup)
  return <Outlet />;
}