import type { AuthResponseUser } from "../../domain/models/user";
import type { IAuthRepository } from "../../domain/repositories/auth.repository.interface";


export async function GoogleExchangeCodeForTokenUseCase(
  authRepository: IAuthRepository,
  code: string,
): Promise<AuthResponseUser> {
  const user = await authRepository.googleExchangeCode(code);
  return user;
}