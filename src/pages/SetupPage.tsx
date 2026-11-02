import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";

export function SetupPage() {
  return (
    <AuthLayout eyebrow="Sign in to your account or create a new one">
      <AuthCard />
    </AuthLayout>
  );
}
export default SetupPage;
