import * as React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsSection, SettingsRow } from "@/components/settings/SettingsSection";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { PinLockSettings } from "@/components/settings/PinLockSettings";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { BackupRestore } from "@/components/settings/BackupRestore";
import { RentSettingsSection } from "@/components/settings/RentSettingsSection";
import { AboutApp } from "@/components/settings/AboutApp";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { clearAllBusinessData } from "@/lib/db";

export function SettingsPage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);
  const [clearDataConfirmOpen, setClearDataConfirmOpen] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate(ROUTES.login);
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      await clearAllBusinessData();
      toast.success("All prior expenses and sales data have been deleted.");
    } catch {
      toast.error("Failed to delete business data.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" description={`Signed in as ${session?.username}`} />

      <div className="space-y-5">
        <SettingsSection title="Appearance" description="Choose how BizPilot looks on this device.">
          <SettingsRow label="Theme" control={<ThemeToggle />} />
        </SettingsSection>

        <SettingsSection
          title="Rent & Reminders"
          description="Configure property rent, landlord contacts, and 5-day month-end reminders."
        >
          <RentSettingsSection />
        </SettingsSection>

        <SettingsSection title="Security" description="Protect access to your business data.">
          <PinLockSettings />
          <SettingsRow
            label="Password"
            description="Change your account password"
            control={
              <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)}>
                Change
              </Button>
            }
          />
        </SettingsSection>

        <SettingsSection
          title="Data Management"
          description="Back up data, restore, or wipe test data."
        >
          <BackupRestore />

          <div className="pt-3 border-t border-border/50">
            <SettingsRow
              label="Delete All Business Data"
              description="Wipe all logged expenses, sales, and balance records (Account stays active)"
              control={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-danger/30 text-danger hover:bg-danger/10 text-xs gap-1.5"
                  onClick={() => setClearDataConfirmOpen(true)}
                  disabled={isClearing}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isClearing ? "Clearing…" : "Clear Data"}
                </Button>
              }
            />
          </div>
        </SettingsSection>

        <SettingsSection title="About">
          <AboutApp />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            label="Log out"
            description="Sign out of BizPilot on this device"
            control={
              <Button variant="outline" size="sm" onClick={() => setLogoutConfirmOpen(true)}>
                <LogOut className="h-3.5 w-3.5" /> Log out
              </Button>
            }
          />
        </SettingsSection>
      </div>

      <ChangePasswordDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} />

      <ConfirmDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Log out of BizPilot?"
        description="You'll need your username and password (or PIN) to sign back in."
        confirmLabel="Log out"
        destructive={false}
        onConfirm={handleLogout}
      />

      <ConfirmDialog
        open={clearDataConfirmOpen}
        onOpenChange={setClearDataConfirmOpen}
        title="Delete all business data?"
        description="This will permanently delete all expenses, daily sales, and reset your cash balances. Your user account and login will remain intact."
        confirmLabel="Yes, Delete All Data"
        destructive={true}
        onConfirm={handleClearData}
      />
    </div>
  );
}
export default SettingsPage;
