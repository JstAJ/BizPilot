import { db } from "@/lib/db";
import { generateId } from "@/lib/utils";
import { todayIso } from "@/lib/date";
import { useDexieQuery } from "@/hooks/useDexieQuery";
import type { FinanceSettings } from "@/types/settings";

export function useFinanceSettings() {
  const { data, isLoading } = useDexieQuery(() => db.financeSettings.get(1), []);
  return { settings: data, isLoading };
}

export async function updateFinanceSettings(patch: Partial<Omit<FinanceSettings, "id">>) {
  await db.financeSettings.update(1, { ...patch, updatedAt: Date.now() });
}

export function useAppSettings() {
  const { data, isLoading } = useDexieQuery(() => db.appSettings.get(1), []);
  return { settings: data, isLoading };
}

export function useTodaySale() {
  const { data, isLoading } = useDexieQuery(
    () => db.dailySales.where("date").equals(todayIso()).first(),
    []
  );
  return { sale: data, isLoading };
}

export async function setTodaySale(amount: number) {
  const date = todayIso();
  const existing = await db.dailySales.where("date").equals(date).first();
  if (existing) {
    await db.dailySales.update(existing.id, { amount, updatedAt: Date.now() });
  } else {
    await db.dailySales.put({ id: generateId("sale"), date, amount, updatedAt: Date.now() });
  }
}

export function useAllSales() {
  const { data, isLoading } = useDexieQuery(() => db.dailySales.toArray(), []);
  return { sales: data ?? [], isLoading };
}
