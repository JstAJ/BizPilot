import {
  Boxes,
  Users,
  Home,
  Zap,
  Flame,
  Truck,
  Building2,
  Wrench,
  UserRound,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import type { ExpenseCategory, PaymentMethod } from "@/types/expense";

export const CATEGORY_META: Record<
  ExpenseCategory,
  { icon: LucideIcon; color: string; bg: string }
> = {
  "Raw Material": { icon: Boxes, color: "text-amber-400", bg: "bg-amber-500/10" },
  Salary: { icon: Users, color: "text-sky-400", bg: "bg-sky-500/10" },
  Rent: { icon: Home, color: "text-purple-400", bg: "bg-purple-500/10" },
  Electricity: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  Gas: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
  Transport: { icon: Truck, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  Office: { icon: Building2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  Maintenance: { icon: Wrench, color: "text-rose-400", bg: "bg-rose-500/10" },
  Personal: { icon: UserRound, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10" },
  Other: { icon: MoreHorizontal, color: "text-gold-400", bg: "bg-gold-500/10" },
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  Cash: "💵",
  "Bank Transfer": "🏦",
  UPI: "📲",
  Card: "💳",
  Cheque: "🧾",
};

export const CHART_COLORS = [
  "#C9A24B",
  "#5B8DEF",
  "#E5484D",
  "#2FA36B",
  "#A78BFA",
  "#F59E0B",
  "#EC4899",
  "#22D3EE",
  "#94A3B8",
];
