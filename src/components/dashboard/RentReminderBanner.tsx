import * as React from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, Home, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMonthEndReminderInfo } from "@/lib/date";
import { useAppSettings } from "@/hooks/useSettings";
import { RentReminderDialog } from "@/components/dashboard/RentReminderDialog";
import { ROUTES } from "@/constants/routes";

export function RentReminderBanner() {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const thresholdDays = settings?.reminderDaysBeforeMonthEnd ?? 5;
  const reminderInfo = React.useMemo(() => {
    return getMonthEndReminderInfo(thresholdDays);
  }, [thresholdDays]);

  // Show banner when inside the 5-day window before month end
  if (!reminderInfo.isReminderPeriod) {
    return (
      <>
        <RentReminderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onRecordRent={() => navigate(ROUTES.addExpense)}
        />
      </>
    );
  }

  const daysLeft = reminderInfo.daysUntilMonthEnd;

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-secondary/40 to-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 animate-pulse">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-purple-300">
                  Month-End Rent Reminder Active
                </h3>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                  {daysLeft === 0
                    ? "Due Today"
                    : daysLeft === 1
                    ? "1 Day Remaining"
                    : `${daysLeft} Days Remaining`}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Month ends on <strong className="text-foreground">{reminderInfo.monthEndFormatted}</strong>.
                Send rent notification to landlord or record rent expense.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs gap-1.5"
              onClick={() => setDialogOpen(true)}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Send Reminder
            </Button>

            <Button
              type="button"
              variant="gold"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate(ROUTES.addExpense)}
            >
              <Home className="h-3.5 w-3.5" />
              Record Rent Paid
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <RentReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onRecordRent={() => navigate(ROUTES.addExpense)}
      />
    </>
  );
}
