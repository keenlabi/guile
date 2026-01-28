import { AuthLayout } from '../../../../../shared/presentation/layouts/AuthLayout/AuthLayout';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import BlockStackIllustration from "src/shared/presentation/assets/images/blocks.png";

export const LoginPage = () => {
  return (
    <AuthLayout
      title={<div>Lumex Onchain. <br /> Go Fast, Go Full, Go Profit!</div>}
      subtitle={"Trading Spot % Futures Assets Quickly and Effortlessly"}
      illustration={BlockStackIllustration}
    >
      <LoginForm />
    </AuthLayout>
  );
};