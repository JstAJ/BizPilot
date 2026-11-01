import { EmptyState } from "@/components/shared/EmptyState";
import { PieChart } from "lucide-react";
import { formatINR } from "@/lib/currency";
import type { ExpenseCategory } from "@/types/expense";

interface Row {
  category: ExpenseCategory;
  total: number;
  count: number;
  percent: number;
  color: string;
}

export function CategoryReportTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="No data for this period"
        description="Expenses recorded in this range will appear here, broken down by category."
      />
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Count</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
            <th className="px-4 py-3 text-right font-medium">Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.category} className="border-b border-border/40 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                  <span className="font-medium">{row.category}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{row.count}</td>
              <td className="num px-4 py-3 text-right font-semibold">{formatINR(row.total)}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{row.percent.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
