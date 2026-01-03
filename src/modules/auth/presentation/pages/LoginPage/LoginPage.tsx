import { AuthLayout } from '../../../../../shared/presentation/layouts/AuthLayout/AuthLayout';
import { LoginForm } from '../../components/LoginForm/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};