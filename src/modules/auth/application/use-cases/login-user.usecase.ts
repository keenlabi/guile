import type { AuthResponseUser } from "../../domain/models/user";
import type { IAuthRepository } from "../../domain/repositories/auth.repository.interface";

export async function LoginUserUseCase(
  authRepository: IAuthRepository,
  data: { email: string; password: string }
): Promise<AuthResponseUser> {
    const user = await authRepository.login(data);
    return user;
}