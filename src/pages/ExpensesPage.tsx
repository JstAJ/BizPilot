import { useNavigate } from "react-router-dom";
import { Plus, Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ExpenseRowSkeleton } from "@/components/shared/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { useFilteredExpenses } from "@/hooks/useExpenses";
import { ROUTES } from "@/constants/routes";

export function ExpensesPage() {
  const navigate = useNavigate();
  const { expenses, allCount, isLoading, filters, setFilters, resetFilters } = useFilteredExpenses();

  return (
    <div>
      <PageHeader
        title="Expenses"
        description={`${allCount} total recorded`}
        action={
          <Button variant="gold" size="sm" onClick={() => navigate(ROUTES.addExpense)} className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        }
      />

      <ExpenseFilters filters={filters} onChange={setFilters} onReset={resetFilters} resultCount={expenses.length} />

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <ExpenseRowSkeleton key={i} />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={allCount === 0 ? "No expenses yet" : "No matching expenses"}
          description={
            allCount === 0
              ? "Start tracking your business spending by adding your first expense."
              : "Try adjusting your search or filters."
          }
          actionLabel={allCount === 0 ? "Add Expense" : undefined}
          onAction={allCount === 0 ? () => navigate(ROUTES.addExpense) : undefined}
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
export default ExpensesPage;
