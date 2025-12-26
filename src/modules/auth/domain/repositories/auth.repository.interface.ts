import type { AuthResponseUser, UserProfile } from "../models/user";

export interface IAuthRepository {
  googleExchangeCode(code: string): Promise<AuthResponseUser>;
  register(data: { email: string; password: string }): Promise<AuthResponseUser>;
  login(data: { email: string; password: string }): Promise<AuthResponseUser>;
  logout(): Promise<void>;
  getProfile(): Promise<UserProfile>;
}