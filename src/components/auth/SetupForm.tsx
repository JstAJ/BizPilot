import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SetupFormValues) => {
    try {
      await setupAccount(values.username, values.password);
      toast.success("Account created. Welcome to BizPilot!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="username">Choose a username</Label>
        <Input id="username" autoComplete="username" placeholder="e.g. ajay" {...register("username")} />
        {errors.username && <p className="text-xs text-danger">{errors.username.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Create a password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </Button>

      {onSwitchToLogin && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-gold-400 hover:text-gold-300 font-medium hover:underline transition-colors"
          >
            Already have an account? Sign in directly →
          </button>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground pt-1">
        Your data stays on this device — BizPilot works fully offline.
      </p>
    </form>
  );
}
