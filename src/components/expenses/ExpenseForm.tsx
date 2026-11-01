import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BillPhotoUpload } from "@/components/expenses/BillPhotoUpload";
import { expenseSchema, type ExpenseFormValues } from "@/lib/validation/expenseSchema";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/types/expense";
import type { Expense } from "@/types/expense";
import { CATEGORY_META, PAYMENT_METHOD_ICONS } from "@/constants/categories";
import { createExpense, updateExpense } from "@/hooks/useExpenses";
import { todayIso } from "@/lib/date";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  expense?: Expense;
}

export function ExpenseForm({ expense }: ExpenseFormProps) {
  const navigate = useNavigate();
  const isEditing = Boolean(expense);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          date: expense.date,
          category: expense.category,
          amount: expense.amount,
          paymentMethod: expense.paymentMethod,
          notes: expense.notes ?? "",
          billPhoto: expense.billPhoto,
        }
      : {
          date: todayIso(),
          category: undefined,
          amount: undefined,
          paymentMethod: undefined,
          notes: "",
          billPhoto: undefined,
        },
  });

  const onSubmit = async (values: ExpenseFormValues) => {
    try {
      if (isEditing && expense) {
        await updateExpense(expense.id, values);
        toast.success("Expense updated");
        navigate(ROUTES.expenseDetails(expense.id));
      } else {
        const created = await createExpense(values);
        toast.success("Expense added");
        navigate(ROUTES.expenseDetails(created.id));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Date & Amount */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <Input id="date" type="date" max={todayIso()} className="pr-10" {...register("date")} />
            <Calendar className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.date && <p className="text-xs text-danger">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              className="pl-9"
              {...register("amount")}
            />
          </div>
          {errors.amount && <p className="text-xs text-danger">{errors.amount.message}</p>}
        </div>
      </div>

      {/* Category & Payment Method - Aligned */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const Icon = meta.icon;
                    return (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded",
                              meta.bg
                            )}
                          >
                            <Icon className={cn("h-3.5 w-3.5", meta.color)} />
                          </span>
                          <span>{cat}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-xs text-danger">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{PAYMENT_METHOD_ICONS[method]}</span>
                        <span>{method}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.paymentMethod && (
            <p className="text-xs text-danger">{errors.paymentMethod.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Optional notes or details…"
          {...register("notes")}
        />
        {errors.notes && <p className="text-xs text-danger">{errors.notes.message}</p>}
      </div>

      {/* Bill Photo */}
      <div className="space-y-2">
        <Label>Bill Photo (Optional)</Label>
        <Controller
          control={control}
          name="billPhoto"
          render={({ field }) => <BillPhotoUpload value={field.value} onChange={field.onChange} />}
        />
      </div>

      {/* Submit / Cancel Buttons */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" variant="gold" className="flex-1" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
