import type { Session } from "@/types/auth";
import {
  SESSION_DURATION_DEFAULT_MS,
  SESSION_DURATION_REMEMBER_MS,
} from "@/constants/app";

const SESSION_KEY = "bizpilot_session";
const LOCK_KEY = "bizpilot_locked";

export function saveSession(userId: string, username: string, remember: boolean): Session {
  const now = Date.now();
  const session: Session = {
    userId,
    username,
    issuedAt: now,
    expiresAt: now + (remember ? SESSION_DURATION_REMEMBER_MS : SESSION_DURATION_DEFAULT_MS),
    remember,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.removeItem(LOCK_KEY);
  return session;
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: Session = JSON.parse(raw);
    if (session.expiresAt < Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LOCK_KEY);
}

export function lockSession() {
  if (getSession()) localStorage.setItem(LOCK_KEY, "1");
}

export function unlockSession() {
  localStorage.removeItem(LOCK_KEY);
}

export function isLocked(): boolean {
  return localStorage.getItem(LOCK_KEY) === "1";
}
