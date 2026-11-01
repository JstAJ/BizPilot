import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { APP_NAME } from "@/constants/app";

import { SetupPage } from "@/pages/SetupPage";
import { LoginPage } from "@/pages/LoginPage";
import { PinLockPage } from "@/pages/PinLockPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ExpensesPage } from "@/pages/ExpensesPage";
import { AddExpensePage } from "@/pages/AddExpensePage";
import { ExpenseDetailsPage } from "@/pages/ExpenseDetailsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function SplashScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background">
      <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-b from-gold-400 to-gold-600 font-display text-lg font-bold text-black">
        BP
      </div>
      <p className="text-sm text-muted-foreground">{APP_NAME}</p>
    </div>
  );
}

/** Gate for setup / login / pin-lock — redirects an already-authenticated,
 *  unlocked user straight into the app instead of showing these screens. */
function GuestRoute() {
  const { isLoading, hasAccount, session, locked } = useAuth();
  if (isLoading) return <SplashScreen />;
  if (hasAccount && session && !locked) return <Navigate to={ROUTES.dashboard} replace />;
  return <Outlet />;
}

/** Gate for the main app shell — routes the visitor to whichever
 *  auth screen matches their current state. */
function ProtectedRoute() {
  const { isLoading, hasAccount, session, locked } = useAuth();
  if (isLoading) return <SplashScreen />;
  if (!hasAccount) return <Navigate to={ROUTES.setup} replace />;
  if (!session) return <Navigate to={ROUTES.login} replace />;
  if (locked) return <Navigate to={ROUTES.pinLock} replace />;
  return <Outlet />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={ROUTES.setup} element={<SetupPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.pinLock} element={<PinLockPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.expenses} element={<ExpensesPage />} />
          <Route path={ROUTES.addExpense} element={<AddExpensePage />} />
          <Route path="/expenses/:id/edit" element={<AddExpensePage />} />
          <Route path="/expenses/:id" element={<ExpenseDetailsPage />} />
          <Route path={ROUTES.reports} element={<ReportsPage />} />
          <Route path={ROUTES.settings} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
