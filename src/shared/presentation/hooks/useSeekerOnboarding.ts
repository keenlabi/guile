import { useState } from 'react';
import { onboardSeekerUseCase } from '../../../modules/onboarding/application/onboarding-seeker.usecase';
import type { SeekerOnboardingData } from '../../../modules/onboarding/domain/schemas/seekerOnboarding.schema';
import { onboardingRepository } from '../../../modules/onboarding/infrastructure/onboarding.repository';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';

export function useSeekerOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const submit = async (data: SeekerOnboardingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardSeekerUseCase(onboardingRepository, data);
      setSuccess(response.message);
      navigate(ROUTES.COMMUNITIES);

    } catch(error: unknown) {
      const apiError = error as unknown as { message: string };
      if (apiError.message) setError(apiError?.message);
      else setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error, success };
}