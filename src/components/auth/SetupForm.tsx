import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setupSchema, type SetupFormValues } from "@/lib/validation/authSchema";
import { useAuth } from "@/hooks/useAuth";

interface SetupFormProps {
  onSwitchToLogin?: () => void;
}

export function SetupForm({ onSwitchToLogin }: SetupFormProps) {
  const { setupAccount } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SetupFormValues) => {
    setErrorMessage(null);
    try {
      await setupAccount(values.username, values.password);
      toast.success(`Account "${values.username}" created successfully. Welcome to BizPilot!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create account.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {errorMessage && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs text-danger flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-danger" />
          <div className="flex-1 space-y-1">
            <p className="font-medium">{errorMessage}</p>
            {onSwitchToLogin && errorMessage.includes("already exists") && (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold underline hover:text-danger-foreground transition-colors block text-[11px]"
              >
                Click here to Sign In with this username →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="su_username" className="text-xs">Choose a username</Label>
        <Input
          id="su_username"
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
        <Label htmlFor="su_password" className="text-xs">Create a password</Label>
        <div className="relative">
          <Input
            id="su_password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="pr-11"
            {...register("password")}
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

      <div className="space-y-1.5">
        <Label htmlFor="su_confirmPassword" className="text-xs">Confirm password</Label>
        <Input
          id="su_confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" variant="gold" size="lg" className="w-full text-xs font-semibold gap-1.5" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        Create New Account
      </Button>

      {onSwitchToLogin && (
        <div className="text-center pt-2 border-t border-border/40">
          <span className="text-xs text-muted-foreground">Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-gold-400 hover:text-gold-300 font-semibold hover:underline transition-colors"
          >
            Sign in directly →
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-muted-foreground">
        BizPilot is offline-first. Your financial data stays stored safely on this device.
      </p>
    </form>
  );
}
