import Dexie, { type EntityTable } from "dexie";
import type { User } from "@/types/auth";
import type { Expense } from "@/types/expense";
import type { AppSettings, FinanceSettings, DailySale } from "@/types/settings";

/**
 * BizPilot's local database. Everything the app needs lives in IndexedDB via
 * Dexie — there is no server in V1, so this file is the single source of
 * truth for persistence and the seam where a future sync backend would plug in.
 */
class BizPilotDatabase extends Dexie {
  users!: EntityTable<User, "id">;
  expenses!: EntityTable<Expense, "id">;
  dailySales!: EntityTable<DailySale, "id">;
  financeSettings!: EntityTable<FinanceSettings, "id">;
  appSettings!: EntityTable<AppSettings, "id">;

  constructor() {
    super("bizpilot-db");

    this.version(1).stores({
      users: "id, username",
      expenses: "id, date, category, paymentMethod, createdAt",
      dailySales: "id, date",
      financeSettings: "id",
      appSettings: "id",
    });
  }
}

export const db = new BizPilotDatabase();

/** Ensures singleton settings rows exist so the rest of the app can assume they do. */
export async function ensureDefaultSettings() {
  const finance = await db.financeSettings.get(1);
  if (!finance) {
    await db.financeSettings.put({
      id: 1,
      cashInHand: 0,
      bankBalance: 0,
      emergencyFund: 0,
      updatedAt: Date.now(),
    });
  }

  const app = await db.appSettings.get(1);
  if (!app) {
    await db.appSettings.put({
      id: 1,
      theme: "dark",
      pinLockEnabled: false,
      updatedAt: Date.now(),
    });
  }
}

/** Clears all expenses and daily sales, resets finance balance to 0 */
export async function clearAllBusinessData() {
  await db.transaction("rw", [db.expenses, db.dailySales, db.financeSettings], async () => {
    await db.expenses.clear();
    await db.dailySales.clear();
    await db.financeSettings.update(1, {
      cashInHand: 0,
      bankBalance: 0,
      emergencyFund: 0,
      updatedAt: Date.now(),
    });
  });
}
