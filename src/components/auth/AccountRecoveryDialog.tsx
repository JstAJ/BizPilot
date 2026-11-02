import * as React from "react";
import { toast } from "sonner";
import { KeyRound, UserCheck, ShieldAlert, Check, Copy, ArrowRight, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/auth";
import { cn } from "@/lib/utils";

interface AccountRecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUsername?: (username: string) => void;
  initialTab?: "username" | "password";
}

export function AccountRecoveryDialog({
  open,
  onOpenChange,
  onSelectUsername,
  initialTab = "password",
}: AccountRecoveryDialogProps) {
  const { getStoredUsers, resetPassword } = useAuth();
  const [tab, setTab] = React.useState<"username" | "password">(initialTab);

  // Stored users state
  const [users, setUsers] = React.useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(false);

  // Reset password form state
  const [resetUsername, setResetUsername] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [resetting, setResetting] = React.useState(false);
  const [copiedUser, setCopiedUser] = React.useState<string | null>(null);

  const loadUsers = React.useCallback(async () => {
    setLoadingUsers(true);
    try {
      const stored = await getStoredUsers();
      setUsers(stored);
      if (stored.length > 0 && !resetUsername) {
        setResetUsername(stored[0].username);
      }
    } catch {
      toast.error("Could not load stored accounts.");
    } finally {
      setLoadingUsers(false);
    }
  }, [getStoredUsers, resetUsername]);

  React.useEffect(() => {
    if (open) {
      setTab(initialTab);
      loadUsers();
    }
  }, [open, initialTab, loadUsers]);

  const handleSelectUser = (name: string) => {
    onSelectUsername?.(name);
    toast.success(`Username "${name}" selected for login`);
    onOpenChange(false);
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedUser(name);
    toast.success(`Copied "${name}" to clipboard`);
    setTimeout(() => setCopiedUser(null), 2000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUsername.trim()) {
      toast.error("Please enter your username.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setResetting(true);
    try {
      await resetPassword(resetUsername, newPassword);
      toast.success("Password reset successfully! Please sign in with your new password.");
      onSelectUsername?.(resetUsername.trim());
      setNewPassword("");
      setConfirmPassword("");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-gold-500/30 bg-card/95 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-500/30 bg-gold-500/10 text-gold-400">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">Account Recovery</DialogTitle>
              <DialogDescription className="text-xs">
                Recover your username or reset your account password
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 rounded-xl bg-secondary/60 p-1 border border-border/60 text-xs">
          <button
            type="button"
            onClick={() => setTab("password")}
            className={cn(
              "py-1.5 font-medium rounded-lg transition-all",
              tab === "password"
                ? "bg-card text-gold-400 shadow-sm border border-gold-500/25 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={() => setTab("username")}
            className={cn(
              "py-1.5 font-medium rounded-lg transition-all",
              tab === "username"
                ? "bg-card text-gold-400 shadow-sm border border-gold-500/25 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Find My Username
          </button>
        </div>

        {tab === "password" ? (
          <form onSubmit={handleResetPassword} className="space-y-3.5 pt-1" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="rec_username" className="text-xs">
                Your Registered Username
              </Label>
              <Input
                id="rec_username"
                placeholder="e.g. ajay"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec_newPassword" className="text-xs">
                New Password (minimum 6 characters)
              </Label>
              <Input
                id="rec_newPassword"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec_confirmPassword" className="text-xs">
                Confirm New Password
              </Label>
              <Input
                id="rec_confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="sm"
              className="w-full text-xs gap-1.5 mt-2"
              disabled={resetting}
            >
              {resetting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save New Password & Sign In
            </Button>
          </form>
        ) : (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-muted-foreground">
              BizPilot stores all business data securely offline on this device. Here are all registered accounts found:
            </p>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-6 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Searching device storage…
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/80 p-4 text-center">
                <ShieldAlert className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                <p className="text-xs font-medium text-foreground">No accounts found on this device</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Please click "Create New Account" on the main page to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-secondary/30 p-2.5 hover:border-gold-500/30 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400 font-semibold text-xs border border-gold-500/20">
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-foreground block">
                          {u.username}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Created {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(u.username)}
                        title="Copy username"
                        className="h-7 w-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                      >
                        {copiedUser === u.username ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <Button
                        type="button"
                        variant="gold"
                        size="sm"
                        className="h-7 px-2.5 text-[11px] gap-1"
                        onClick={() => handleSelectUser(u.username)}
                      >
                        <UserCheck className="h-3 w-3" />
                        Use
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
