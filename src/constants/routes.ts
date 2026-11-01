export const ROUTES = {
  setup: "/setup",
  login: "/login",
  pinLock: "/pin-lock",
  dashboard: "/dashboard",
  expenses: "/expenses",
  addExpense: "/expenses/add",
  expenseDetails: (id: string) => `/expenses/${id}`,
  editExpense: (id: string) => `/expenses/${id}/edit`,
  reports: "/reports",
  settings: "/settings",
} as const;
