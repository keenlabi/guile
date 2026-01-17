import { useState } from 'react';
import { userRepository } from 'src/modules/user/infrastructure/repositories/user.repository';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { useToast } from 'src/shared/presentation/hooks/useToast';

export const useAiMode = () => {
  const { profile, refreshProfile } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const toggleAiMode = async (enable: boolean) => {
    setIsLoading(true);
    try {
      const response = await userRepository.toggleAiMode(enable);
      
      // Feedback
      showSuccess(response.message);
      
      // Critical: Refresh profile so the UI (OrderForm) knows we are now managed
      await refreshProfile(); 
      
    } catch (error) {
      showError(error, "Failed to toggle AI mode");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isManaged: profile?.isManaged || false,
    toggleAiMode,
    isLoading
  };
};