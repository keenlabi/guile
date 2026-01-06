import type { Wallet } from "src/modules/wallet/domain/wallet.types";
import type { UserProfile } from "src/modules/auth/domain/models/user";
import { walletRepository } from "src/modules/wallet/infrastructure/repositories/wallet.repository"
import apiClient from "src/shared/infrastructure/http/api-client";
import type { ApiResponse } from "src/shared/domain/model/api-response.model";

export interface TraderSummary {
  id: string;
  userId: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
}

export const adminRepository = {
  getTraders: async (): Promise<TraderSummary[]> => {
    const { data } = await apiClient.get<ApiResponse<TraderSummary[]>>('/api/profiles/traders');
    return data.data;
  },

  async getProfileByUserId(userId: string): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(`/api/profiles/${userId}`);
    return response.data.data;
  },

  getTraderWallet: async (userId: string): Promise<Wallet> => {
    const data = await walletRepository.getUserWallet(userId);
    return data;
  },

  creditUserWalletNaira: async (userId: string, symbol: string, amountUsd: number) => {
    const response = await apiClient.post<ApiResponse<void>>('/api/wallets/credit', { 
      userId, 
      symbol, 
      amountUsd
    });
    console.log(response)
    return response
  },
  
  debitUserWallet: async (userId: string, symbol: string, amountUsd: number) => {
    return await apiClient.post<ApiResponse<void>>('/api/wallets/debit', { 
      userId, 
      symbol, 
      amountUsd 
    });
  }
};