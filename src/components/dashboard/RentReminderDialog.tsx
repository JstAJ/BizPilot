import * as React from "react";
import { format, endOfMonth } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, Copy, Check, Home, Sparkles } from "lucide-react";
import { useAppSettings, updateAppSettings } from "@/hooks/useSettings";

interface RentReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordRent?: () => void;
}

export function RentReminderDialog({
  open,
  onOpenChange,
  onRecordRent,
}: RentReminderDialogProps) {
  const { settings } = useAppSettings();

  const [landlordName, setLandlordName] = React.useState("");
  const [landlordPhone, setLandlordPhone] = React.useState("");
  const [rentAmount, setRentAmount] = React.useState("0");
  const [copied, setCopied] = React.useState(false);

  const now = new Date();
  const currentMonthName = format(now, "MMMM yyyy");
  const monthEndDate = format(endOfMonth(now), "dd MMMM yyyy");

  // Load saved settings when dialog opens
  React.useEffect(() => {
    if (open && settings) {
      setLandlordName(settings.landlordName || "");
      setLandlordPhone(settings.landlordPhone || "");
      setRentAmount(String(settings.rentAmount || ""));
    }
  }, [open, settings]);

  const reminderMessage = React.useMemo(() => {
    const greeting = landlordName ? `Dear ${landlordName}` : "Hello";
    const amountStr = rentAmount && parseFloat(rentAmount) > 0 ? `₹${parseFloat(rentAmount).toLocaleString("en-IN")}` : "Rent";
    return `${greeting},\n\nThis is a friendly reminder regarding the property rent payment of ${amountStr} for ${currentMonthName}, due before ${monthEndDate}.\n\nPlease let me know if payment details or receipts are required.\n\nThank you!`;
  }, [landlordName, rentAmount, currentMonthName, monthEndDate]);

  const handleSaveDefaults = async () => {
    await updateAppSettings({
      landlordName,
      landlordPhone,
      rentAmount: parseFloat(rentAmount) || 0,
    });
    toast.success("Rent reminder details saved");
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(reminderMessage);
      setCopied(true);
      toast.success("Reminder message copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy message.");
    }
  };

  const handleSendWhatsApp = async () => {
    await handleSaveDefaults();

    // Clean phone number (remove spaces, dashes)
    let cleanPhone = landlordPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`; // Default Indian country code if 10 digits
    }

    const encodedText = encodeURIComponent(reminderMessage);
    const whatsappUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp with your reminder…");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>Send Rent Reminder</DialogTitle>
              <DialogDescription className="text-xs">
                Send month-end rent notice via WhatsApp or copy message
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="landlordName" className="text-xs">
                Recipient / Landlord Name
              </Label>
              <Input
                id="landlordName"
                placeholder="e.g. Sharma Ji"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rentAmount" className="text-xs">
                Rent Amount (₹)
              </Label>
              <Input
                id="rentAmount"
                type="number"
                placeholder="25000"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="landlordPhone" className="text-xs">
              WhatsApp Phone Number (Optional)
            </Label>
            <Input
              id="landlordPhone"
              placeholder="e.g. 9876543210"
              value={landlordPhone}
              onChange={(e) => setLandlordPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="preview" className="text-xs flex items-center gap-1 text-muted-foreground">
                <Sparkles className="h-3 w-3 text-gold-400" /> Message Preview
              </Label>
              <span className="text-[10px] text-muted-foreground">Due: {monthEndDate}</span>
            </div>
            <Textarea
              id="preview"
              rows={4}
              readOnly
              value={reminderMessage}
              className="resize-none text-xs bg-secondary/40 font-mono text-muted-foreground"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0 pt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyMessage}
              className="gap-1.5 text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Text"}
            </Button>

            {onRecordRent && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onRecordRent();
                }}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Record Rent Paid
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={handleSendWhatsApp}
            className="gap-1.5 text-xs"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Send via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
