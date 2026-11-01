import * as React from "react";
import { toast } from "sonner";
import { MessageSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSettings, updateAppSettings } from "@/hooks/useSettings";
import { RentReminderDialog } from "@/components/dashboard/RentReminderDialog";

export function RentSettingsSection() {
  const { settings } = useAppSettings();

  const [landlordName, setLandlordName] = React.useState("");
  const [landlordPhone, setLandlordPhone] = React.useState("");
  const [rentAmount, setRentAmount] = React.useState("0");
  const [reminderDays, setReminderDays] = React.useState("5");
  const [reminderDialogOpen, setReminderDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (settings) {
      setLandlordName(settings.landlordName || "");
      setLandlordPhone(settings.landlordPhone || "");
      setRentAmount(String(settings.rentAmount || "0"));
      setReminderDays(String(settings.reminderDaysBeforeMonthEnd ?? 5));
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAppSettings({
        landlordName,
        landlordPhone,
        rentAmount: parseFloat(rentAmount) || 0,
        reminderDaysBeforeMonthEnd: parseInt(reminderDays, 10) || 5,
      });
      toast.success("Rent reminder preferences updated");
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="s_landlordName" className="text-xs">
            Landlord / Owner Name
          </Label>
          <Input
            id="s_landlordName"
            placeholder="e.g. Sharma Ji"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="s_rentAmount" className="text-xs">
            Monthly Rent (₹)
          </Label>
          <Input
            id="s_rentAmount"
            type="number"
            placeholder="25000"
            value={rentAmount}
            onChange={(e) => setRentAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="s_landlordPhone" className="text-xs">
            WhatsApp Phone Number
          </Label>
          <Input
            id="s_landlordPhone"
            placeholder="e.g. 9876543210"
            value={landlordPhone}
            onChange={(e) => setLandlordPhone(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="s_reminderDays" className="text-xs">
            Reminder Days Before Month-End
          </Label>
          <Input
            id="s_reminderDays"
            type="number"
            min="1"
            max="15"
            placeholder="5"
            value={reminderDays}
            onChange={(e) => setReminderDays(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            Alert shows {reminderDays} days before month-end
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs gap-1.5"
          onClick={() => setReminderDialogOpen(true)}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Preview & Send Reminder
        </Button>

        <Button
          type="button"
          variant="gold"
          size="sm"
          className="text-xs gap-1.5"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="h-3.5 w-3.5" />
          Save Preferences
        </Button>
      </div>

      <RentReminderDialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen} />
    </div>
  );
}
