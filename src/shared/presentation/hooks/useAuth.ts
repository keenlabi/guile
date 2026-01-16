import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authRepository from '../../../modules/auth/infrastructure/repositories/auth.repository';
import { LoginUserUseCase } from '../../../modules/auth/application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from 'src/modules/auth/application/use-cases/register-user.usecase';

export function useAuth() {

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  async function registerUser(data: {
    email: string, 
    password: string
  }){
    await RegisterUserUseCase(authRepository, data);
    // context?.setLogin(user);
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
    registerUser,
    logoutUser,
  };
}