import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// import authRepository from '../../../modules/auth/infrastructure/repositories/auth.repository';
// import { GoogleExchangeCodeForTokenUseCase } from '../../../modules/auth/application/use-cases/google-exchange-code-for-token';

export function useGoogleCallback() {
  const [searchParams] = useSearchParams();
  const [error,] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      // setError('Google authentication failed. Please try again.');
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
  }, [searchParams]);

  return { error, isLoading: !error };
}