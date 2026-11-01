import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema, type LoginFormValues } from "@/lib/validation/authSchema";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", rememberMe: true },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password, values.rememberMe);
      toast.success(`Welcome back, ${values.username}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" autoComplete="username" placeholder="e.g. ajay" {...register("username")} />
        {errors.username && <p className="text-xs text-danger">{errors.username.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
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

      <label className="flex cursor-pointer items-center gap-2.5">
        <Checkbox
          checked={watch("rememberMe")}
          onCheckedChange={(checked) => setValue("rememberMe", Boolean(checked))}
        />
        <span className="text-sm text-muted-foreground">Remember me on this device</span>
      </label>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign in
      </Button>

      {onSwitchToSignup && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-xs text-gold-400 hover:text-gold-300 font-medium hover:underline transition-colors"
          >
            Don't have an account? Create an account →
          </button>
        </div>
      )}
    </form>
  );
}
