import {
  format,
  parseISO,
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  endOfWeek,
  endOfMonth,
  subDays,
  isWithinInterval,
  eachDayOfInterval,
} from "date-fns";

export function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDisplayDate(iso: string): string {
  try {
    return format(parseISO(iso), "dd MMM yyyy");
  } catch {
    return iso;
  }
}

export function formatDisplayDateTime(timestamp: number): string {
  return format(new Date(timestamp), "dd MMM yyyy, hh:mm a");
}

export function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export const dateRanges = {
  today: () => ({ start: startOfDay(new Date()), end: endOfDay(new Date()) }),
  thisWeek: () => ({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  }),
  thisMonth: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }),
  last30Days: () => ({ start: startOfDay(subDays(new Date(), 29)), end: endOfDay(new Date()) }),
};

export function isDateInRange(iso: string, start: Date, end: Date): boolean {
  try {
    return isWithinInterval(parseISO(iso), { start, end });
  } catch {
    return false;
  }
}

export function daysBetween(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}
