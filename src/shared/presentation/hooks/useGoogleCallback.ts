import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import authRepository from '../../../features/auth/infrastructure/repositories/auth.repository';
import { useAuth } from './useAuth';
// import { GoogleExchangeCodeForTokenUseCase } from '../../../features/auth/application/use-cases/google-exchange-code-for-token';

export function useGoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Google authentication failed. Please try again.');
      return;
    }

    if (code) {
        // GoogleExchangeCodeForTokenUseCase(authRepository, code)
        // .then((user) => {
        //     loginWithGoogle(user);
        //     navigate('/communities');
        // })
        // .catch((err) => {
        //     if (err instanceof Error) {
        //         setError(err.message);
        //     } else {
        //         setError('An unknown error occurred.');
        //     }
        // });
    }
  }, [searchParams, loginWithGoogle, navigate]);

  return { error, isLoading: !error };
}