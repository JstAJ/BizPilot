import * as React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SetupForm } from "@/components/auth/SetupForm";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  initialMode?: "login" | "signup";
}

export function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const [mode, setMode] = React.useState<"login" | "signup">(initialMode);

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 rounded-xl bg-secondary/60 p-1 border border-border/60">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all",
            mode === "login"
              ? "bg-card text-gold-400 shadow-sm border border-gold-500/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </button>

        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all",
            mode === "signup"
              ? "bg-card text-gold-400 shadow-sm border border-gold-500/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Create Account
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm onSwitchToSignup={() => setMode("signup")} />
      ) : (
        <SetupForm onSwitchToLogin={() => setMode("login")} />
      )}
    </div>
  );
}

