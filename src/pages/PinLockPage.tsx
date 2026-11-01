import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PinPad } from "@/components/auth/PinPad";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function PinLockPage() {
  const { session, unlockWithPin, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!session) navigate(ROUTES.login, { replace: true });
  }, [session, navigate]);

  const handlePin = async (pin: string) => {
    const ok = await unlockWithPin(pin);
    if (ok) {
      navigate(ROUTES.dashboard);
    } else {
      setError(true);
      toast.error("Incorrect PIN");
      setTimeout(() => setError(false), 500);
    }
  };

  const handleLogoutInstead = async () => {
    await logout();
    navigate(ROUTES.login);
  };

  return (
    <AuthLayout eyebrow={`Welcome back, ${session?.username ?? ""}`}>
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground">Enter your PIN to continue</p>
        <PinPad onComplete={handlePin} error={error} />
        <Button variant="link" size="sm" onClick={handleLogoutInstead}>
          Use password instead
        </Button>
      </div>
    </AuthLayout>
  );
}
export default PinLockPage;
