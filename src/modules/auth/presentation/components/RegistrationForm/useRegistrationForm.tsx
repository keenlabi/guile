import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegistration } from '../../../../../shared/presentation/hooks/useRegistration';
import { useGoogleAuth } from '../../../../../shared/presentation/hooks/useGoogleAuth';
import { registrationSchema, type RegistrationFormData } from '../../../domain/schemas/register.schema';

export default function useRegistrationForm() {
  const { register: registerUser, isLoading, error: apiError } = useRegistration();
  const { startGoogleLogin } = useGoogleAuth();

  const { register, handleSubmit, formState } = useForm<RegistrationFormData>({
    mode: 'onChange',
    resolver: zodResolver(registrationSchema),
    defaultValues: { email: '', password: '', agreeToTerms: false },
  });

  const onSubmit = (data: RegistrationFormData) => {
    registerUser({ email: data.email, password: data.password });
  };

  const submit = () => void handleSubmit(onSubmit)();

  return {
    register,
    submit,
    errors: formState.errors,
    isValid: formState.isValid,
    isLoading,
    apiError,
    startGoogleLogin,
  };
}