import { Link } from "react-router-dom";
import { Receipt, ChevronRight } from "lucide-react";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ROUTES } from "@/constants/routes";
import type { Expense } from "@/types/expense";

export function RecentExpensesList({ expenses }: { expenses: Expense[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Recent Expenses</h2>
        {expenses.length > 0 && (
          <Link
            to={ROUTES.expenses}
            className="flex items-center gap-0.5 text-xs font-medium text-gold-400 hover:underline"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses recorded"
          description="Track your first business expense to see it here."
          actionLabel="Add Expense"
          onAction={() => (window.location.href = ROUTES.addExpense)}
        />
      ) : (
        <div className="space-y-2.5">
          {expenses.map((e, i) => (
            <ExpenseCard key={e.id} expense={e} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
