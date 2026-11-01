import { Wallet, Receipt, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatINR, formatCompactINR } from "@/lib/currency";
import type { Expense } from "@/types/expense";

interface Props {
  total: number;
  count: number;
  average: number;
  highest: Expense | null;
}

export function ReportSummaryCards({ total, count, average, highest }: Props) {
  const items = [
    { label: "Total Spent", value: formatCompactINR(total), icon: Wallet, tone: "text-gold-400" },
    { label: "Transactions", value: String(count), icon: Receipt, tone: "text-foreground" },
    { label: "Average", value: formatCompactINR(average), icon: TrendingUp, tone: "text-foreground" },
    {
      label: "Highest Expense",
      value: highest ? formatINR(highest.amount) : "—",
      icon: Award,
      tone: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </span>
            <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className={`num text-lg font-semibold ${item.tone}`}>{item.value}</span>
        </Card>
      ))}
    </div>
  );
}
