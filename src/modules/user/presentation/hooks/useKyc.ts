import { useState } from 'react';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import type { KycSubmissionData } from '../../domain/kyc.types';
import { userRepository } from '../../infrastructure/repositories/user.repository';

export const useKyc = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { refreshProfile } = useAuth();

  const submitKyc = async (data: KycSubmissionData) => {
    setIsLoading(true);
    try {
      // 1. Submit Data
      const response = await userRepository.submitKyc(data);
      
      // 2. Feedback
      showSuccess(response.message || "KYC Submitted Successfully");
      
      // 3. Update Global User State (to show "Pending" badge immediately)
      await refreshProfile();
      
      return true; // Return success signal
    } catch (error) {
      showError(error, "Failed to submit KYC");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitKyc,
    isLoading
  };
};