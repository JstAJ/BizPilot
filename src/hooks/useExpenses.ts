import * as React from "react";
import { db } from "@/lib/db";
import { generateId } from "@/lib/utils";
import { useDexieQuery } from "@/hooks/useDexieQuery";
import type { Expense, ExpenseFilters, ExpenseInput } from "@/types/expense";

const DEFAULT_FILTERS: ExpenseFilters = {
  search: "",
  category: "All",
  paymentMethod: "All",
  sortField: "date",
  sortDirection: "desc",
};

/** Live list of all expenses, newest first at the data layer. */
export function useAllExpenses() {
  const { data, isLoading } = useDexieQuery(
    () => db.expenses.orderBy("date").reverse().toArray(),
    []
  );
  return { expenses: data ?? [], isLoading };
}

export function useExpense(id: string | undefined) {
  const { data, isLoading } = useDexieQuery(
    () => (id ? db.expenses.get(id) : undefined),
    [id]
  );
  return { expense: data, isLoading: Boolean(id) && isLoading };
}

/** Filtering + sorting over the live expense list, driven by local UI state. */
export function useFilteredExpenses() {
  const { expenses, isLoading } = useAllExpenses();
  const [filters, setFilters] = React.useState<ExpenseFilters>(DEFAULT_FILTERS);

  const filtered = React.useMemo(() => {
    let result = [...expenses];

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.category.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q) ||
          e.paymentMethod.toLowerCase().includes(q) ||
          String(e.amount).includes(q)
      );
    }
    if (filters.category !== "All") {
      result = result.filter((e) => e.category === filters.category);
    }
    if (filters.paymentMethod !== "All") {
      result = result.filter((e) => e.paymentMethod === filters.paymentMethod);
    }
    if (filters.dateFrom) {
      result = result.filter((e) => e.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter((e) => e.date <= filters.dateTo!);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortField === "amount") cmp = a.amount - b.amount;
      else if (filters.sortField === "category") cmp = a.category.localeCompare(b.category);
      else cmp = a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
      return filters.sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [expenses, filters]);

  const resetFilters = React.useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { expenses: filtered, allCount: expenses.length, isLoading, filters, setFilters, resetFilters };
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const now = Date.now();
  const expense: Expense = { id: generateId("exp"), ...input, createdAt: now, updatedAt: now };
  await db.expenses.put(expense);
  return expense;
}

export async function updateExpense(id: string, input: Partial<ExpenseInput>): Promise<void> {
  await db.expenses.update(id, { ...input, updatedAt: Date.now() });
}

export async function deleteExpense(id: string): Promise<void> {
  await db.expenses.delete(id);
}
