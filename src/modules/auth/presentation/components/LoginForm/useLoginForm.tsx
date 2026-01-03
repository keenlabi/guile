import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../../domain/schemas/login.schema';
import { useAuth } from '../../../../../shared/presentation/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../../shared/presentation/routes/routes';

export default function useLoginForm() {
  const { loginWithPassword } = useAuth();
  const navigate = useNavigate();

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoginLoading(true);
    setError(null);
    try {
      await loginWithPassword({ email: data.email, password: data.password });
      navigate({ pathname: ROUTES.DASHBOARD });
    } catch(error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        // Handle specific API error shapes if needed
        const apiError = error as { message: string };
        setError(apiError.message || 'An unexpected login error occurred.');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  const submit = () => void handleSubmit(onSubmit)();

  return {
    register,
    submit,
    errors: formState.errors,
    isValid: formState.isValid,
    isLoginLoading,
    loginError: error,
  };
}