import type { ApiResponse } from "../../../../shared/domain/model/api-response.model";
import apiClient from "../../../../shared/infrastructure/http/api-client";
import type { AuthResponseUser, UserProfile } from "../../domain/models/user";
import type { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

const authRepository: IAuthRepository = {
  async googleExchangeCode(code: string): Promise<AuthResponseUser> {
    const response = await apiClient.post<{ user: AuthResponseUser; }>('/auth/google/exchange-code', { code });
    return response.data.user;
  },

  async register(data: { email: string; password: string; }): Promise<AuthResponseUser> {
    try {
      const response = await apiClient.post<{ user: AuthResponseUser; }>('/api/users/register', data);
      return response.data.user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async login(data: { email: string; password: string; }): Promise<AuthResponseUser> {
    const response = await apiClient.post<{ user: AuthResponseUser; }>('/api/auth/login', data);
    return response.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<{ profile: UserProfile }>>('/api/users/me');
    return response.data.data.profile;
  }
};

export default authRepository;