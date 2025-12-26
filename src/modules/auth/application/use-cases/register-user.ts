import type { AuthResponseUser } from "../../domain/models/user";
import type { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export async function registerUser (
  authRepository: IAuthRepository,
  data: { email: string; password: string }
): Promise<AuthResponseUser> {
  return await authRepository.register(data);
}