import { useState, useCallback } from 'react';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import type { KycSubmissionData, KycStatusResponse } from '../../domain/kyc.types';
import { userRepository } from '../../infrastructure/repositories/user.repository';

export const useKyc = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<KycStatusResponse | null>(null);
  const { showSuccess, showError } = useToast();
  const { refreshProfile } = useAuth();

  const fetchKycStatus = useCallback(async () => {
    try {
      const data = await userRepository.getKycStatus();
      setKycStatus(data);
    } catch (error) {
      console.error("Failed to fetch KYC status", error);
    }
  }, []);

  const submitKyc = async (data: KycSubmissionData) => {
    setIsLoading(true);
    try {
      const response = await userRepository.submitKyc(data);
      showSuccess(response.message || "KYC Submitted Successfully");
      await refreshProfile();
      await fetchKycStatus(); // Refresh local status
      return true;
    } catch (error) {
      showError(error, "Failed to submit KYC");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitKyc,
    fetchKycStatus,
    kycStatus,
    isLoading
  };
};