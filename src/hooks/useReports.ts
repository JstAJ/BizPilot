import * as React from "react";
import { useAllExpenses } from "@/hooks/useExpenses";
import { dateRanges, isDateInRange } from "@/lib/date";
import { CHART_COLORS } from "@/constants/categories";
import type { Expense, ExpenseCategory } from "@/types/expense";

export type ReportRange = "daily" | "weekly" | "monthly";

function rangeFor(range: ReportRange) {
  if (range === "daily") return dateRanges.today();
  if (range === "weekly") return dateRanges.thisWeek();
  return dateRanges.thisMonth();
}

export function useReportData(range: ReportRange) {
  const { expenses, isLoading } = useAllExpenses();

  const data = React.useMemo(() => {
    const { start, end } = rangeFor(range);
    const scoped = expenses.filter((e) => isDateInRange(e.date, start, end));

    const total = scoped.reduce((sum, e) => sum + e.amount, 0);
    const count = scoped.length;
    const average = count > 0 ? total / count : 0;
    const highest = scoped.reduce<Expense | null>(
      (max, e) => (!max || e.amount > max.amount ? e : max),
      null
    );

    const byCategory = new Map<ExpenseCategory, { total: number; count: number }>();
    for (const e of scoped) {
      const entry = byCategory.get(e.category) ?? { total: 0, count: 0 };
      entry.total += e.amount;
      entry.count += 1;
      byCategory.set(e.category, entry);
    }
    const categoryBreakdown = Array.from(byCategory.entries())
      .map(([category, v], i) => ({
        category,
        total: v.total,
        count: v.count,
        percent: total > 0 ? (v.total / total) * 100 : 0,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }))
      .sort((a, b) => b.total - a.total);

    const items = [...scoped].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

    return { total, count, average, highest, categoryBreakdown, items, start, end };
  }, [expenses, range]);

  return { ...data, isLoading };
}
