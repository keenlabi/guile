import apiClient from "src/shared/infrastructure/http/api-client";
import type { Wallet, WalletAsset } from "../../domain/wallet.types";
import type { ApiResponse } from "src/shared/domain/model/api-response.model";

export const walletRepository = {
  getAssets: async (): Promise<WalletAsset[]> => {
    const { data } = await apiClient.get<{ data: WalletAsset[] }>('/api/assets');
    return data.data;
  },

  getMyWallet: async (): Promise<Wallet> => {
    const { data } = await apiClient.get<{data: Wallet}>('/api/wallets/me');
    return data.data;
  },

  getUserWallet: async (userId: string): Promise<Wallet> => {
    const { data } = await apiClient.get<ApiResponse<Wallet>>(`/api/wallets/${userId}`);
    return data.data;
  }
};