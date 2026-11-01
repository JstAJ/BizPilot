import { z } from "zod";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/types/expense";

export const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  amount: z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .positive("Amount must be greater than zero")
    .max(100000000, "Amount seems too large"),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
  billPhoto: z.string().optional(),
});
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
