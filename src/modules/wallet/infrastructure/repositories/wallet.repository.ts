import apiClient from "src/shared/infrastructure/http/api-client";
import type { Asset, Transaction, Wallet, WithdrawRequest } from "../../domain/wallet.types";
import type { ApiResponse } from "src/shared/domain/model/api-response.model";

export const walletRepository = {
  async getTransactions(): Promise<Transaction[]> {
    // API returns { success: true, data: [...] }
    const response = await apiClient.get<ApiResponse<{data: Transaction[]}>>('/api/wallets/transactions');
    return response.data.data.data;
  },

  getAssets: async (): Promise<Asset[]> => {
    const { data } = await apiClient.get<ApiResponse<{ data: Asset[] }>>('/api/assets');
    return data.data.data;
  },

  getMyWallet: async (): Promise<Wallet> => {
    const { data } = await apiClient.get<{data: Wallet}>('/api/wallets/me');
    return data.data;
  },

  getUserWallet: async (userId: string): Promise<Wallet> => {
    const { data } = await apiClient.get<ApiResponse<Wallet>>(`/api/wallets/${userId}`);
    return data.data;
  },

  async requestWithdrawal(payload: WithdrawRequest): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>('/api/wallets/withdraw', payload);
    return response.data.data
  }
};