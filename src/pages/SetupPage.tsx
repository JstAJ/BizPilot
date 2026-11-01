import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";

export function SetupPage() {
  return (
    <AuthLayout eyebrow="Sign in or set up your business account">
      <AuthCard initialMode="signup" />
    </AuthLayout>
  );
}
export default SetupPage;
