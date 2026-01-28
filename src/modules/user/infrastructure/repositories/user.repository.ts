import apiClient from "src/shared/infrastructure/http/api-client";
import type { KycResponse, KycStatusResponse, KycSubmissionData } from "../../domain/kyc.types";
import type { ApiResponse } from "src/shared/domain/model/api-response.model";

export const userRepository = {
  async getKycStatus(): Promise<KycStatusResponse> {
    // Assuming the endpoint is prefixed with /api like others
    const { data } = await apiClient.get<ApiResponse<KycStatusResponse>>('/api/kyc/status');
    return data.data;
  },

  async toggleAiMode(enable: boolean): Promise<{ isManaged: boolean; message: string }> {
    const { data } = await apiClient.put<ApiResponse<{ isManaged: boolean; message: string }>>(
      '/api/users/managed-mode', 
      { enable }
    );
    return data.data;
  },

  async submitKyc(data: KycSubmissionData): Promise<KycResponse> {
    const formData = new FormData();

    // 1. Append Text Fields
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('dob', data.dob);
    formData.append('country', data.country);
    formData.append('documentType', data.documentType);

    // 2. Append Files (Strict checking)
    // Note: The key name ('documentFront') must match what the backend expects
    formData.append('documentFront', data.documentFront!);

    if (data.documentBack) {
      formData.append('documentBack', data.documentBack);
    }

    if (data.selfie) {
      formData.append('selfie', data.selfie);
    }

    // 3. Send Request
    // Axios/apiClient automatically detects FormData and sets 'Content-Type: multipart/form-data'
    const response = await apiClient.post<KycResponse>('/api/kyc/submit', formData);
    
    // Adjust return based on your standard API wrapper (e.g. response.data or response.data.data)
    return response.data; 
  }
};