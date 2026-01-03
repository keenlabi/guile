import apiClient from "src/shared/infrastructure/http/api-client";
import type { AssetConfig, Wallet } from "../../domain/wallet.types";

export const walletRepository = {
  getAssets: async (): Promise<AssetConfig[]> => {
    const { data } = await apiClient.get<{ data: AssetConfig[] }>('/assets');
    return data.data;
  },

  getMyWallet: async (): Promise<Wallet> => {
    const { data } = await apiClient.get<Wallet>('/wallets/me');
    return data;
  },

  simulateDeposit: async (amount: number): Promise<{ message: string; balance: number }> => {
    const { data } = await apiClient.post('/wallets/deposit', { amount });
    return data;
  }
};