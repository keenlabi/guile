import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authRepository from '../../../features/auth/infrastructure/repositories/auth.repository';
import { GoogleExchangeCodeForTokenUseCase } from '../../../features/auth/application/use-cases/google-exchange-code-for-token';
import { LoginUserUseCase } from '../../../features/auth/application/use-cases/login-user.usecase';
// Import your use cases here in the future
// import { loginUser } from '../../features/auth/application/use-cases/loginUser';

export function useAuth() {

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  async function loginWithGoogle(code: string) {
    await GoogleExchangeCodeForTokenUseCase(authRepository, code);
    // context?.setLogin(profile);
    await context?.refreshProfile();
  };
  
  async function loginWithPassword(data: {email: string, password: string}){
    await LoginUserUseCase(authRepository, data);
    // context?.setLogin(user);
    await context?.refreshProfile();
  };

  const logoutUser = async () => {
    // const user = await logoutUser(authRepository);
    // context.logout();
  };

  return {
    ...context,
    loginWithPassword,
    loginWithGoogle,
    logoutUser,
  };
}