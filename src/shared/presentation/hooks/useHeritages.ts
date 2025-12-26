import { useQuery } from '@tanstack/react-query';
import { onboardingRepository } from '../../../modules/onboarding/infrastructure/onboarding.repository';
import type { MultiSelectOption } from '../components/FormFields/MultiSelectField/MultiSelectField';
import { getHeritagesUseCase } from '../../../modules/onboarding/application/get-heritages.usecase';

// Query Keys for caching
export const HERITAGE_KEYS = {
  all: ['heritages'] as const,
};

export function useHeritages() {
  const { data: heritages = [], isLoading, error } = useQuery({
    queryKey: HERITAGE_KEYS.all,
    queryFn: () => getHeritagesUseCase(onboardingRepository),
  });

  // Transform to MultiSelectOption format
  const heritageOptions: MultiSelectOption[] = heritages.map(h => ({
    label: h.name.charAt(0).toUpperCase() + h.name.slice(1), 
    value: h.id 
  }));

  return { 
    heritages, 
    heritageOptions, 
    isLoading, 
    error: error ? (error as Error).message : null 
  };
}