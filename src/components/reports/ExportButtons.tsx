import { FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/utils";
import { formatDisplayDate } from "@/lib/date";
import { APP_NAME } from "@/constants/app";
import type { Expense } from "@/types/expense";
import type { ReportRange } from "@/hooks/useReports";

interface Props {
  items: Expense[];
  range: ReportRange;
}

export function ExportButtons({ items, range }: Props) {
  const exportCsv = () => {
    if (items.length === 0) {
      toast.error("No expenses to export for this period.");
      return;
    }
    const rows = [
      ["Date", "Category", "Amount (INR)", "Payment Method", "Notes"],
      ...items.map((e) => [formatDisplayDate(e.date), e.category, e.amount, e.paymentMethod, e.notes ?? ""]),
    ];
    downloadCsv(`${APP_NAME}_${range}_report_${Date.now()}.csv`, rows);
    toast.success("CSV exported");
  };

  const exportPdf = () => {
    toast.info("PDF export is coming in the next update.");
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportCsv}>
        <FileSpreadsheet className="h-3.5 w-3.5" /> Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={exportPdf}>
        <FileText className="h-3.5 w-3.5" /> Export PDF
      </Button>
    </div>
  );
}
