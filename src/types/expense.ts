export const EXPENSE_CATEGORIES = [
  "Raw Material",
  "Salary",
  "Rent",
  "Electricity",
  "Gas",
  "Transport",
  "Office",
  "Maintenance",
  "Personal",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "UPI", "Card", "Cheque"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Expense {
  id: string;
  date: string; // ISO date string, e.g. 2026-08-04
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  billPhoto?: string; // base64 data URL
  createdAt: number;
  updatedAt: number;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt" | "updatedAt">;

export type SortField = "date" | "amount" | "category";
export type SortDirection = "asc" | "desc";

export interface ExpenseFilters {
  search: string;
  category: ExpenseCategory | "All";
  paymentMethod: PaymentMethod | "All";
  dateFrom?: string;
  dateTo?: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
