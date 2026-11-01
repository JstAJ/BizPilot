import * as React from "react";
import { useAllExpenses } from "@/hooks/useExpenses";
import { useFinanceSettings, useTodaySale, useAllSales } from "@/hooks/useSettings";
import { todayIso, dateRanges, isDateInRange, toIsoDate } from "@/lib/date";
import { CHART_COLORS } from "@/constants/categories";
import type { ExpenseCategory } from "@/types/expense";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export function useDashboardStats() {
  const { expenses, isLoading: expensesLoading } = useAllExpenses();
  const { settings: finance, isLoading: financeLoading } = useFinanceSettings();
  const { sale, isLoading: saleLoading } = useTodaySale();
  const { sales, isLoading: salesLoading } = useAllSales();

  const stats = React.useMemo(() => {
    const today = todayIso();
    const todaysExpenses = expenses.filter((e) => e.date === today);
    const todaysExpenseTotal = todaysExpenses.reduce((sum, e) => sum + e.amount, 0);
    const todaysSales = sale?.amount ?? sales.find((s) => s.date === today)?.amount ?? 0;
    const todaysProfit = todaysSales - todaysExpenseTotal;

    // Monthly calculations
    const now = new Date();
    const { start: monthStart, end: monthEnd } = dateRanges.thisMonth();
    const monthExpenses = expenses.filter((e) => isDateInRange(e.date, monthStart, monthEnd));
    const monthExpenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const monthSales = sales.filter((s) => isDateInRange(s.date, monthStart, monthEnd));
    const monthSalesTotal = monthSales.reduce((sum, s) => sum + s.amount, 0);

    const monthProfit = monthSalesTotal - monthExpenseTotal;
    const monthProfitMargin = monthSalesTotal > 0 ? (monthProfit / monthSalesTotal) * 100 : 0;
    const monthName = format(now, "MMMM yyyy");
    const currentMonthLabel = format(now, "MMMM");
    const dayOfMonth = now.getDate();
    const monthDailyAvgExpense = dayOfMonth > 0 ? monthExpenseTotal / dayOfMonth : 0;

    // Category breakdown (all-time, capped to last 30 days for relevance)
    const { start, end } = dateRanges.last30Days();
    const last30 = expenses.filter((e) => isDateInRange(e.date, start, end));

    const byCategory = new Map<ExpenseCategory, number>();
    for (const e of last30) {
      byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
    }
    const categoryData = Array.from(byCategory.entries())
      .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }))
      .sort((a, b) => b.value - a.value);

    // Last 30 days daily totals
    const dayTotals = new Map<string, number>();
    for (const e of last30) {
      dayTotals.set(e.date, (dayTotals.get(e.date) ?? 0) + e.amount);
    }
    const last30Data: { date: string; label: string; amount: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = toIsoDate(d);
      last30Data.push({ date: iso, label: format(d, "d MMM"), amount: dayTotals.get(iso) ?? 0 });
    }

    // Monthly trend, last 6 months
    const monthlyData: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const mStart = startOfMonth(monthDate);
      const mEnd = endOfMonth(monthDate);
      const total = expenses
        .filter((e) => isDateInRange(e.date, mStart, mEnd))
        .reduce((sum, e) => sum + e.amount, 0);
      monthlyData.push({ month: format(monthDate, "MMM"), amount: total });
    }

    const recentExpenses = [...expenses]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    return {
      todaysSales,
      todaysExpenseTotal,
      todaysProfit,
      cashInHand: finance?.cashInHand ?? 0,
      bankBalance: finance?.bankBalance ?? 0,
      emergencyFund: finance?.emergencyFund ?? 0,
      categoryData,
      last30Data,
      monthlyData,
      recentExpenses,
      totalExpensesCount: expenses.length,
      // Month stats
      monthName,
      currentMonthLabel,
      monthSalesTotal,
      monthExpenseTotal,
      monthProfit,
      monthProfitMargin,
      monthExpenseCount: monthExpenses.length,
      monthSalesCount: monthSales.length,
      monthDailyAvgExpense,
    };
  }, [expenses, finance, sale, sales]);

  return { ...stats, isLoading: expensesLoading || financeLoading || saleLoading || salesLoading };
}
