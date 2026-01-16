import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { useAuth } from './useAuth';

export function useRegistration() {
  
  const { registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(data);
      navigate(ROUTES.MARKET);

    } catch (error) {
      
      if(error instanceof Error) {
        setError(error.message || 'An unknown error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}