import * as React from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { SettingsRow } from "@/components/settings/SettingsSection";
import { PinPad } from "@/components/auth/PinPad";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useDexieQuery } from "@/hooks/useDexieQuery";
import { db } from "@/lib/db";

export function PinLockSettings() {
  const { session, setPin, disablePin } = useAuth();
  const { data: user } = useDexieQuery(
    () => (session ? db.users.get(session.userId) : undefined),
    [session]
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [step, setStep] = React.useState<"create" | "confirm">("create");
  const [firstPin, setFirstPin] = React.useState("");
  const [pinError, setPinError] = React.useState(false);

  const pinEnabled = user?.pinEnabled ?? false;

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setStep("create");
      setFirstPin("");
      setDialogOpen(true);
    } else {
      disablePin();
      toast.success("PIN lock disabled");
    }
  };

  const handlePinEntry = async (pin: string) => {
    if (step === "create") {
      setFirstPin(pin);
      setStep("confirm");
      return;
    }
    if (pin !== firstPin) {
      setPinError(true);
      toast.error("PINs did not match. Try again.");
      setTimeout(() => {
        setPinError(false);
        setStep("create");
        setFirstPin("");
      }, 500);
      return;
    }
    await setPin(pin);
    toast.success("PIN lock enabled");
    setDialogOpen(false);
  };

  return (
    <>
      <SettingsRow
        label="PIN Lock"
        description={pinEnabled ? "4-digit PIN required to unlock BizPilot" : "Add a quick-unlock PIN"}
        control={<Switch checked={pinEnabled} onCheckedChange={handleToggle} />}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{step === "create" ? "Create a PIN" : "Confirm your PIN"}</DialogTitle>
            <DialogDescription>
              {step === "create"
                ? "Choose a 4-digit PIN for quick unlock."
                : "Enter the same PIN again to confirm."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <PinPad key={step} onComplete={handlePinEntry} error={pinError} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
