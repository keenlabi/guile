import { RegistrationForm } from "../../components/RegistrationForm/RegistrationForm";
import { AuthLayout } from "../../../../../shared/presentation/layouts/AuthLayout/AuthLayout";
import BlockStackIllustration from "src/shared/presentation/assets/images/blocks.png";

export function RegistrationPage() {
  return (
    <AuthLayout
      title={<div>Guile Onchain. <br /> Go Fast, Go Full, Go Profit!</div>}
      subtitle={"Trading Spot % Futures Assets Quickly and Effortlessly"}
      illustration={BlockStackIllustration}
    >
      <RegistrationForm />
    </AuthLayout>
  );
}