import { useNavigate } from "react-router-dom";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowUpRight,
  ChevronRight,
  Scale,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatCompactINR } from "@/lib/currency";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface MonthlyOverviewProps {
  monthName: string;
  monthSales: number;
  monthExpenses: number;
  monthProfit: number;
  monthProfitMargin: number;
  expenseCount: number;
  salesCount: number;
  dailyAvgExpense: number;
  onRecordSales?: () => void;
}

export function MonthlyOverview({
  monthName,
  monthSales,
  monthExpenses,
  monthProfit,
  monthProfitMargin,
  expenseCount,
  salesCount,
  dailyAvgExpense,
  onRecordSales,
}: MonthlyOverviewProps) {
  const navigate = useNavigate();

  const isProfitable = monthProfit > 0;
  const isLoss = monthProfit < 0;
  const hasSales = monthSales > 0;
  const hasExpenses = monthExpenses > 0;

  // Percentage of revenue consumed by expenses (capped at 100 for bar width)
  const expenseRatio = hasSales ? Math.min(100, Math.round((monthExpenses / monthSales) * 100)) : 100;
  const profitRatio = hasSales && isProfitable ? Math.max(0, 100 - expenseRatio) : 0;

  return (
    <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-secondary/20 shadow-lg">
      {/* Subtle ambient highlight for gold theme */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold-500/5 blur-3xl" />

      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/10 text-gold-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg">Monthly Financial Overview</CardTitle>
                <Badge variant="outline" className="text-[10px] font-medium text-gold-400 border-gold-500/30">
                  {monthName}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Overall monthly profit, revenue, and expense tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hasSales && !hasExpenses ? (
              <Badge variant="outline">No activity yet</Badge>
            ) : !hasSales ? (
              <Badge variant="danger">Expenses only</Badge>
            ) : isProfitable ? (
              <Badge variant="success" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {monthProfitMargin.toFixed(0)}% Margin • Profitable
              </Badge>
            ) : isLoss ? (
              <Badge variant="danger" className="gap-1">
                <TrendingDown className="h-3 w-3" />
                Net Loss
              </Badge>
            ) : (
              <Badge variant="gold">Break Even</Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => navigate(ROUTES.reports)}
            >
              Reports <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Key 3 KPI Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Overall Net Profit */}
          <div
            className={cn(
              "rounded-xl border p-4 transition-all",
              isProfitable
                ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/15"
                : isLoss
                ? "border-red-500/30 bg-red-500/5 dark:bg-red-950/15"
                : "border-border bg-secondary/30"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Overall Net Profit
              </span>
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  isProfitable
                    ? "bg-emerald-500/15 text-emerald-500"
                    : isLoss
                    ? "bg-red-500/15 text-red-500"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isProfitable ? (
                  <TrendingUp className="h-4 w-4" />
                ) : isLoss ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <Scale className="h-4 w-4" />
                )}
              </div>
            </div>

            <div className="mt-2.5">
              <div
                className={cn(
                  "num text-2xl font-bold tracking-tight sm:text-3xl",
                  isProfitable
                    ? "text-emerald-500"
                    : isLoss
                    ? "text-red-500"
                    : "text-foreground"
                )}
              >
                {formatINR(monthProfit)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {hasSales ? (
                  <span>
                    <strong className={isProfitable ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                      {isProfitable ? "+" : ""}
                      {monthProfitMargin.toFixed(1)}%
                    </strong>{" "}
                    profit margin on total sales
                  </span>
                ) : (
                  "Sales - Expenses for this month"
                )}
              </p>
            </div>
          </div>

          {/* Month Total Expenses */}
          <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4 dark:bg-red-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Month Expenses
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/15 text-red-500">
                <Receipt className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="num text-2xl font-bold tracking-tight text-red-400 sm:text-3xl">
                {formatINR(monthExpenses)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {expenseCount > 0 ? (
                  <span>
                    {expenseCount} {expenseCount === 1 ? "expense" : "expenses"} recorded (avg{" "}
                    {formatCompactINR(dailyAvgExpense)}/day)
                  </span>
                ) : (
                  "No expenses recorded this month"
                )}
              </p>
            </div>
          </div>

          {/* Month Total Sales / Revenue */}
          <div className="rounded-xl border border-gold-500/25 bg-gold-500/5 p-4 dark:bg-gold-950/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Month Sales / Revenue
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500/15 text-gold-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="num text-2xl font-bold tracking-tight text-gold-400 sm:text-3xl">
                {formatINR(monthSales)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {salesCount > 0 ? (
                  <span>
                    {salesCount} {salesCount === 1 ? "day" : "days"} of sales recorded
                  </span>
                ) : (
                  "No sales recorded yet this month"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Revenue Utilization Bar / Alert */}
        {hasSales ? (
          <div className="rounded-xl border border-border/70 bg-secondary/25 p-3.5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Revenue Allocation Breakdown</span>
              <span className="text-muted-foreground">
                {expenseRatio}% Expenses • {profitRatio}% Retained Profit
              </span>
            </div>

            {/* Progress split bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                style={{ width: `${expenseRatio}%` }}
                className={cn(
                  "transition-all duration-500",
                  isLoss ? "bg-red-500" : "bg-amber-500/80"
                )}
                title={`Expenses: ${formatINR(monthExpenses)} (${expenseRatio}%)`}
              />
              {profitRatio > 0 && (
                <div
                  style={{ width: `${profitRatio}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title={`Profit: ${formatINR(monthProfit)} (${profitRatio}%)`}
                />
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", isLoss ? "bg-red-500" : "bg-amber-500")} />
                  Expenses: <strong>{formatINR(monthExpenses)}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Net Profit: <strong>{formatINR(monthProfit)}</strong>
                </span>
              </div>
              {monthExpenses > monthSales && (
                <span className="text-red-400">
                  ⚠️ Expenses exceed sales by {formatINR(monthExpenses - monthSales)}
                </span>
              )}
            </div>
          </div>
        ) : hasExpenses ? (
          <div className="flex flex-col items-start justify-between gap-2.5 rounded-xl border border-gold-500/30 bg-gold-500/5 p-3.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs text-gold-300">
              <Sparkles className="h-4 w-4 shrink-0 text-gold-400" />
              <span>
                You have recorded <strong>{formatINR(monthExpenses)}</strong> in expenses. Record your daily
                sales to compute accurate net monthly profit and margin!
              </span>
            </div>
            {onRecordSales && (
              <Button
                size="sm"
                variant="gold"
                className="h-7 text-xs font-medium shrink-0"
                onClick={onRecordSales}
              >
                Record Sales
              </Button>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

