import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryIcon } from "@/components/expenses/CategoryIcon";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpense, deleteExpense } from "@/hooks/useExpenses";
import { formatINR } from "@/lib/currency";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/date";
import { ROUTES } from "@/constants/routes";

export function ExpenseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expense, isLoading } = useExpense(id);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!id) return;
    await deleteExpense(id);
    toast.success("Expense deleted");
    navigate(ROUTES.expenses);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-sm text-muted-foreground">This expense could not be found.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate(ROUTES.expenses)}>
          Back to Expenses
        </Button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(ROUTES.expenses)}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Expenses
      </button>

      <div className="glass-panel p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <CategoryIcon category={expense.category} className="h-14 w-14" />
            <div>
              <p className="font-display text-lg font-semibold">{expense.category}</p>
              <p className="text-sm text-muted-foreground">{formatDisplayDate(expense.date)}</p>
            </div>
          </div>
          <span className="num text-2xl font-bold text-gold-400">{formatINR(expense.amount)}</span>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-border/60 pt-5 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Payment Method</dt>
            <dd className="mt-1 font-medium">{expense.paymentMethod}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Recorded</dt>
            <dd className="mt-1 font-medium">{formatDisplayDateTime(expense.createdAt)}</dd>
          </div>
          {expense.notes && (
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Notes</dt>
              <dd className="mt-1">{expense.notes}</dd>
            </div>
          )}
        </dl>

        {expense.billPhoto && (
          <div className="mt-5 border-t border-border/60 pt-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Bill Photo</p>
            <img
              src={expense.billPhoto}
              alt="Bill"
              className="max-h-80 w-full rounded-xl border border-border object-contain bg-black/20"
            />
          </div>
        )}

        <div className="mt-6 flex gap-3 border-t border-border/60 pt-5">
          <Button variant="outline" className="flex-1" onClick={() => navigate(ROUTES.editExpense(expense.id))}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this expense?"
        description={`This will permanently remove this ${formatINR(expense.amount)} ${expense.category} expense. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
export default ExpenseDetailsPage;
