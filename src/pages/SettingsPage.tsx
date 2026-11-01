import * as React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsSection, SettingsRow } from "@/components/settings/SettingsSection";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { PinLockSettings } from "@/components/settings/PinLockSettings";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { BackupRestore } from "@/components/settings/BackupRestore";
import { AboutApp } from "@/components/settings/AboutApp";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function SettingsPage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate(ROUTES.login);
  };

  return (
    <div>
      <PageHeader title="Settings" description={`Signed in as ${session?.username}`} />

      <div className="space-y-5">
        <SettingsSection title="Appearance" description="Choose how BizPilot looks on this device.">
          <SettingsRow label="Theme" control={<ThemeToggle />} />
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
          title="Data"
          description="Back up your data or restore it on a new device."
        >
          <BackupRestore />
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
    </div>
  );
}
export default SettingsPage;
