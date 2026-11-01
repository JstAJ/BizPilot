import { AuthLayout } from "@/components/auth/AuthLayout";
import { SetupForm } from "@/components/auth/SetupForm";

export function SetupPage() {
  return (
    <AuthLayout eyebrow="Let's set up your business account">
      <SetupForm />
    </AuthLayout>
  );
}
export default SetupPage;
