import type { Transaction, Wallet } from "src/modules/wallet/domain/wallet.types";
import type { UserProfile } from "src/modules/auth/domain/models/user";
import { walletRepository } from "src/modules/wallet/infrastructure/repositories/wallet.repository"
import apiClient from "src/shared/infrastructure/http/api-client";
import type { ApiResponse } from "src/shared/domain/model/api-response.model";
import type { KycRequest } from "src/modules/user/domain/kyc.types";

export interface TraderSummary {
  id: string;
  userId: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
  isManaged: boolean;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
}

export const adminRepository = {
  getPendingWithdrawals: async (): Promise<Transaction[]> => {
    const { data } = await apiClient.get<ApiResponse<Transaction[]>>('/api/wallets/withdrawals/pending');
    // Safety check for array
    return Array.isArray(data.data) ? data.data : [];
  },

  processWithdrawal: async (id: string, action: 'APPROVE' | 'REJECT', txHash?: string) => {
    const { data } = await apiClient.put(`/api/wallets/withdrawals/${id}/process`, { 
      action, 
      txHash 
    });
    return data;
  },

  getTraders: async (): Promise<TraderSummary[]> => {
    const { data } = await apiClient.get<ApiResponse<TraderSummary[]>>('/api/profiles/traders');
    return Array.isArray(data.data) ? data.data : [];
  },

  async getProfileByUserId(userId: string): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(`/api/profiles/${userId}`);
    return response.data.data;
  },

  getTraderWallet: async (userId: string): Promise<Wallet> => {
    const data = await walletRepository.getUserWallet(userId);
    return data;
  },

  creditUserWallet: async (userId: string, symbol: string, amountUsd: number) => {
    const response = await apiClient.post<ApiResponse<void>>('/api/wallets/credit', { 
      userId,
      symbol, 
      amountUsd
    });
    return response;
  },
  
  debitUserWallet: async (userId: string, symbol: string, amountUsd: number) => {
    return await apiClient.post<ApiResponse<void>>('/api/wallets/debit', { 
      userId, 
      symbol, 
      amountUsd 
    });
  },

  // --- KYC METHODS (Updated with Safe Mapping) ---

  getPendingKyc: async (): Promise<KycRequest[]> => {
    // 1. Get the raw response data
    const response = await apiClient.get<ApiResponse<KycRequest[]>>('/api/admin/kyc/pending');
    const rawData = response.data.data;


    // 3. Map snake_case to camelCase
    return rawData.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      firstName: item.first_name,
      lastName: item.last_name,
      dob: item.dob,
      country: item.country,
      documentType: item.document_type,
      documentFrontUrl: item.document_front_url,
      documentBackUrl: item.document_back_url,
      selfieUrl: item.selfie_url,
      status: item.status,
      rejectionReason: item.rejection_reason,
      createdAt: item.created_at,
      user: item.user ? {
        id: item.user.id,
        email: item.user.email,
        role: item.user.role,
        status: item.user.status,
        emailVerified: item.user.email_verified
      } : {
        id: 'unknown',
        email: 'Unknown User',
        role: 'trader',
        status: 'unknown',
        emailVerified: false
      }
    }));
  },

  reviewKyc: async (id: string, action: 'APPROVE' | 'REJECT', reason?: string) => {
    const { data } = await apiClient.put(`/api/admin/kyc/${id}/review`, { 
      action, 
      reason 
    });
    return data;
  }
};