import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpense } from "@/hooks/useExpenses";

export function AddExpensePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { expense, isLoading } = useExpense(id);

  if (isEditing && isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight">
        {isEditing ? "Edit Expense" : "Add Expense"}
      </h1>
      <div className="glass-panel p-5 sm:p-6">
        <ExpenseForm expense={isEditing ? expense : undefined} />
      </div>
    </div>
  );
}
export default AddExpensePage;
