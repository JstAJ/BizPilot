import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/types/expense";
import type { ExpenseFilters as Filters, SortField } from "@/types/expense";

interface ExpenseFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  resultCount: number;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
  { value: "category", label: "Category" },
];

export function ExpenseFilters({ filters, onChange, onReset, resultCount }: ExpenseFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.category !== "All" || filters.paymentMethod !== "All";

  return (
    <div className="mb-4 space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search expenses…"
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.category}
          onValueChange={(v) => onChange({ ...filters, category: v as Filters["category"] })}
        >
          <SelectTrigger className="h-9 w-auto min-w-[130px] text-[13px]">
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 opacity-60" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentMethod}
          onValueChange={(v) => onChange({ ...filters, paymentMethod: v as Filters["paymentMethod"] })}
        >
          <SelectTrigger className="h-9 w-auto min-w-[130px] text-[13px]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All payments</SelectItem>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortField}
          onValueChange={(v) => onChange({ ...filters, sortField: v as SortField })}
        >
          <SelectTrigger className="h-9 w-auto min-w-[110px] text-[13px]">
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5 opacity-60" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() =>
            onChange({
              ...filters,
              sortDirection: filters.sortDirection === "asc" ? "desc" : "asc",
            })
          }
          title={filters.sortDirection === "asc" ? "Ascending" : "Descending"}
        >
          {filters.sortDirection === "asc" ? "↑" : "↓"}
        </Button>

        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {resultCount} {resultCount === 1 ? "expense" : "expenses"} found
      </p>
    </div>
  );
}
