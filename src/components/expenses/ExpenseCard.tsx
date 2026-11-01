import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CategoryIcon } from "@/components/expenses/CategoryIcon";
import { formatINR } from "@/lib/currency";
import { formatDisplayDate } from "@/lib/date";
import { ROUTES } from "@/constants/routes";
import type { Expense } from "@/types/expense";

export function ExpenseCard({ expense, index = 0 }: { expense: Expense; index?: number }) {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      onClick={() => navigate(ROUTES.expenseDetails(expense.id))}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
      className="glass-panel flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface-hover"
    >
      <CategoryIcon category={expense.category} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium">{expense.category}</p>
        <p className="truncate text-xs text-muted-foreground">
          {formatDisplayDate(expense.date)} · {expense.paymentMethod}
        </p>
      </div>
      <span className="num shrink-0 text-[15px] font-semibold">{formatINR(expense.amount)}</span>
    </motion.button>
  );
}
