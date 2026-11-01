import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wallet, Receipt, TrendingUp, Banknote, Landmark, ShieldCheck, Pencil } from "lucide-react";
import { toast } from "sonner";
import { GreetingHeader } from "@/components/dashboard/GreetingHeader";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { MonthlyOverview } from "@/components/dashboard/MonthlyOverview";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { Last30DaysChart } from "@/components/dashboard/Last30DaysChart";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { RecentExpensesList } from "@/components/dashboard/RecentExpensesList";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { setTodaySale } from "@/hooks/useSettings";
import { updateFinanceSettings, useFinanceSettings } from "@/hooks/useSettings";
import { ROUTES } from "@/constants/routes";

export function DashboardPage() {
  const stats = useDashboardStats();
  const { settings: finance } = useFinanceSettings();
  const navigate = useNavigate();

  const [salesDialogOpen, setSalesDialogOpen] = React.useState(false);
  const [financeDialogOpen, setFinanceDialogOpen] = React.useState(false);
  const [salesInput, setSalesInput] = React.useState("");
  const [financeInput, setFinanceInput] = React.useState({
    cashInHand: "0",
    bankBalance: "0",
    emergencyFund: "0",
  });

  React.useEffect(() => {
    if (salesDialogOpen) setSalesInput(String(stats.todaysSales || ""));
  }, [salesDialogOpen, stats.todaysSales]);

  React.useEffect(() => {
    if (financeDialogOpen && finance) {
      setFinanceInput({
        cashInHand: String(finance.cashInHand),
        bankBalance: String(finance.bankBalance),
        emergencyFund: String(finance.emergencyFund),
      });
    }
  }, [financeDialogOpen, finance]);

  const saveSales = async () => {
    const amount = parseFloat(salesInput) || 0;
    await setTodaySale(amount);
    toast.success("Today's sales updated");
    setSalesDialogOpen(false);
  };

  const saveFinance = async () => {
    await updateFinanceSettings({
      cashInHand: parseFloat(financeInput.cashInHand) || 0,
      bankBalance: parseFloat(financeInput.bankBalance) || 0,
      emergencyFund: parseFloat(financeInput.emergencyFund) || 0,
    });
    toast.success("Business finances updated");
    setFinanceDialogOpen(false);
  };

  if (stats.isLoading) {
    return (
      <div>
        <GreetingHeader />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div>
      <GreetingHeader />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard label="Today's Sales" amount={stats.todaysSales} icon={TrendingUp} tone="gold" delay={0} onClick={() => setSalesDialogOpen(true)} />
        <SummaryCard label="Today's Expense" amount={stats.todaysExpenseTotal} icon={Receipt} tone="danger" delay={0.03} />
        <SummaryCard
          label="Today's Profit"
          amount={stats.todaysProfit}
          icon={Wallet}
          tone={stats.todaysProfit >= 0 ? "success" : "danger"}
          delay={0.06}
        />
        <SummaryCard label="Cash in Hand" amount={stats.cashInHand} icon={Banknote} delay={0.09} onClick={() => setFinanceDialogOpen(true)} />
        <SummaryCard label="Bank Balance" amount={stats.bankBalance} icon={Landmark} delay={0.12} onClick={() => setFinanceDialogOpen(true)} />
        <SummaryCard label="Emergency Fund" amount={stats.emergencyFund} icon={ShieldCheck} delay={0.15} onClick={() => setFinanceDialogOpen(true)} />
      </div>

      {/* Overall monthly profit & expenses section */}
      <div className="mb-6">
        <MonthlyOverview
          monthName={stats.monthName}
          monthSales={stats.monthSalesTotal}
          monthExpenses={stats.monthExpenseTotal}
          monthProfit={stats.monthProfit}
          monthProfitMargin={stats.monthProfitMargin}
          expenseCount={stats.monthExpenseCount}
          salesCount={stats.monthSalesCount}
          dailyAvgExpense={stats.monthDailyAvgExpense}
          onRecordSales={() => setSalesDialogOpen(true)}
        />
      </div>

      <div className="mb-6 flex flex-row gap-3">
        <Button variant="gold" className="flex-1 sm:flex-none" onClick={() => navigate(ROUTES.addExpense)}>
          <Plus className="h-4 w-4" /> Quick Add Expense
        </Button>
        <Button variant="outline" className="flex-1 sm:flex-none border-gold-500/30 text-gold-400 hover:bg-gold-500/10 hover:text-gold-300" onClick={() => setSalesDialogOpen(true)}>
          <TrendingUp className="h-4 w-4" /> Record Today's Sales
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryPieChart data={stats.categoryData} />
        <MonthlyTrendChart data={stats.monthlyData} />
      </div>

      <div className="mb-6">
        <Last30DaysChart data={stats.last30Data} />
      </div>

      <RecentExpensesList expenses={stats.recentExpenses} />

      {/* Today's sales dialog */}
      <Dialog open={salesDialogOpen} onOpenChange={setSalesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Today's Sales</DialogTitle>
            <DialogDescription>Enter your total sales for today.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="sales">Amount (₹)</Label>
            <Input
              id="sales"
              type="number"
              inputMode="decimal"
              value={salesInput}
              onChange={(e) => setSalesInput(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="gold" onClick={saveSales}>
              <Pencil className="h-3.5 w-3.5" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finance settings dialog */}
      <Dialog open={financeDialogOpen} onOpenChange={setFinanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Business Finances</DialogTitle>
            <DialogDescription>Keep your cash position accurate and up to date.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cash">Cash in Hand (₹)</Label>
              <Input
                id="cash"
                type="number"
                value={financeInput.cashInHand}
                onChange={(e) => setFinanceInput((f) => ({ ...f, cashInHand: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Bank Balance (₹)</Label>
              <Input
                id="bank"
                type="number"
                value={financeInput.bankBalance}
                onChange={(e) => setFinanceInput((f) => ({ ...f, bankBalance: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Fund (₹)</Label>
              <Input
                id="emergency"
                type="number"
                value={financeInput.emergencyFund}
                onChange={(e) => setFinanceInput((f) => ({ ...f, emergencyFund: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="gold" onClick={saveFinance}>
              <Pencil className="h-3.5 w-3.5" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default DashboardPage;
