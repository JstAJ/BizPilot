import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, AlertCircle, KeyRound, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormValues } from "@/lib/validation/authSchema";
import { useAuth } from "@/hooks/useAuth";
import { AccountRecoveryDialog } from "@/components/auth/AccountRecoveryDialog";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  initialUsername?: string;
}

export function LoginForm({ onSwitchToSignup, initialUsername = "" }: LoginFormProps) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Recovery dialog state
  const [recoveryOpen, setRecoveryOpen] = React.useState(false);
  const [recoveryTab, setRecoveryTab] = React.useState<"username" | "password">("password");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: initialUsername, password: "", rememberMe: true },
  });

  React.useEffect(() => {
    if (initialUsername) {
      setValue("username", initialUsername);
    }
  }, [initialUsername, setValue]);

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await login(values.username, values.password, values.rememberMe);
      toast.success(`Welcome back, ${values.username}! All your saved business data is loaded.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not sign in.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const openRecovery = (type: "username" | "password") => {
    setRecoveryTab(type);
    setRecoveryOpen(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Inline Error Callout if credentials do not match */}
        {errorMessage && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs text-danger flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-danger" />
            <div className="flex-1 space-y-1">
              <p className="font-medium">{errorMessage}</p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => openRecovery("password")}
                  className="font-semibold underline hover:text-danger-foreground transition-colors"
                >
                  Reset Password →
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => openRecovery("username")}
                  className="font-semibold underline hover:text-danger-foreground transition-colors"
                >
                  View Saved Usernames →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="username" className="text-xs">Username</Label>
            <button
              type="button"
              onClick={() => openRecovery("username")}
              className="text-[11px] text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-0.5"
            >
              <HelpCircle className="h-3 w-3" />
              Forgot Username?
            </button>
          </div>
          <Input
            id="username"
            autoComplete="username"
            placeholder="e.g. ajay"
            {...register("username")}
            onChange={(e) => {
              register("username").onChange(e);
              setErrorMessage(null);
            }}
          />
          {errors.username && <p className="text-xs text-danger">{errors.username.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs">Password</Label>
            <button
              type="button"
              onClick={() => openRecovery("password")}
              className="text-[11px] text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-0.5"
            >
              <KeyRound className="h-3 w-3" />
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-11"
              {...register("password")}
              onChange={(e) => {
                register("password").onChange(e);
                setErrorMessage(null);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 pt-0.5">
          <Checkbox
            checked={watch("rememberMe")}
            onCheckedChange={(checked) => setValue("rememberMe", Boolean(checked))}
          />
          <span className="text-xs text-muted-foreground">Keep me signed in on this device</span>
        </label>

        <Button type="submit" variant="gold" size="lg" className="w-full text-xs font-semibold" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign In to BizPilot
        </Button>

        {onSwitchToSignup && (
          <div className="text-center pt-2 border-t border-border/40">
            <span className="text-xs text-muted-foreground">Don't have an account yet? </span>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold hover:underline transition-colors"
            >
              Create New Account →
            </button>
          </div>
        )}
      </form>

      <AccountRecoveryDialog
        open={recoveryOpen}
        onOpenChange={setRecoveryOpen}
        initialTab={recoveryTab}
        onSelectUsername={(name) => {
          setValue("username", name);
          setErrorMessage(null);
        }}
      />
    </>
  );
}
