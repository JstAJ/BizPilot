import * as React from "react";
import { LogIn, UserPlus, Sparkles, CheckCircle2 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SetupForm } from "@/components/auth/SetupForm";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  initialMode?: "login" | "signup";
}

export function AuthCard({ initialMode }: AuthCardProps) {
  const { hasAccount } = useAuth();

  // If an account exists on this device, default to "login", otherwise "signup"
  const defaultMode = initialMode ?? (hasAccount ? "login" : "signup");
  const [mode, setMode] = React.useState<"login" | "signup">(defaultMode);

  // Sync mode if hasAccount loads after initial mount
  React.useEffect(() => {
    if (!initialMode) {
      setMode(hasAccount ? "login" : "signup");
    }
  }, [hasAccount, initialMode]);

  return (
    <div className="space-y-5">
      {/* Account presence badge */}
      <div className="flex justify-center">
        {hasAccount ? (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400 shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Account detected on this device</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[11px] font-medium text-gold-400 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            <span>Offline-First Business Management</span>
          </div>
        )}
      </div>

      {/* Two Prominent Theme-Styled Buttons/Tabs */}
      <div className="grid grid-cols-2 rounded-2xl bg-secondary/80 p-1.5 border border-gold-500/20 shadow-inner">
        {/* Sign In Tab */}
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 px-3 text-xs font-semibold transition-all duration-200",
            mode === "login"
              ? "bg-gradient-to-b from-card to-background text-gold-400 shadow-gold-glow border border-gold-500/40"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <div className="flex items-center gap-1.5">
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </div>
          <span className="text-[10px] font-normal opacity-75">Existing Account</span>
        </button>

        {/* Create Account Tab */}
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 px-3 text-xs font-semibold transition-all duration-200",
            mode === "signup"
              ? "bg-gradient-to-b from-card to-background text-gold-400 shadow-gold-glow border border-gold-500/40"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <div className="flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            <span>Create Account</span>
          </div>
          <span className="text-[10px] font-normal opacity-75">New Registration</span>
        </button>
      </div>

      {/* Form rendering */}
      <div className="pt-1">
        {mode === "login" ? (
          <LoginForm onSwitchToSignup={() => setMode("signup")} />
        ) : (
          <SetupForm onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
