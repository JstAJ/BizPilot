import { LayoutDashboard, Receipt, BarChart3, Settings } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Expenses", path: ROUTES.expenses, icon: Receipt },
  { label: "Reports", path: ROUTES.reports, icon: BarChart3 },
  { label: "Settings", path: ROUTES.settings, icon: Settings },
] as const;
