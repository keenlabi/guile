import { RegistrationForm } from "../../components/RegistrationForm/RegistrationForm";
import { AuthLayout } from "../../../../../shared/presentation/layouts/AuthLayout/AuthLayout";

export function RegistrationPage() {
  return (
    <AuthLayout>
      <RegistrationForm />
    </AuthLayout>
  );
}