import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";

export function LoginPage() {
  return (
    <AuthLayout eyebrow="Sign in to your business dashboard">
      <AuthCard initialMode="login" />
    </AuthLayout>
  );
}
export default LoginPage;
