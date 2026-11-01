import { CATEGORY_META } from "@/constants/categories";
import type { ExpenseCategory } from "@/types/expense";
import { cn } from "@/lib/utils";

export function CategoryIcon({
  category,
  className,
}: {
  category: ExpenseCategory;
  className?: string;
}) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  return (
    <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", meta.bg, className)}>
      <Icon className={cn("h-5 w-5", meta.color)} />
    </div>
  );
}
