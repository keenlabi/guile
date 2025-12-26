import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../features/auth/application/use-cases/register-user';
import authRepository from '../../../features/auth/infrastructure/repositories/auth.repository';
import { ROUTES } from '../routes/routes';

export function useRegistration() {
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(authRepository, data);
      navigate(ROUTES.CHOOSE_PATH);
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