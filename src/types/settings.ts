export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  id: 1;
  theme: ThemeMode;
  pinLockEnabled: boolean;
  updatedAt: number;
}

export interface FinanceSettings {
  id: 1;
  cashInHand: number;
  bankBalance: number;
  emergencyFund: number;
  updatedAt: number;
}

export interface DailySale {
  id: string;
  date: string; // ISO date
  amount: number;
  updatedAt: number;
}

export interface BackupPayload {
  exportedAt: string;
  version: string;
  users: unknown[];
  expenses: unknown[];
  dailySales: unknown[];
  financeSettings: unknown[];
  appSettings: unknown[];
}
