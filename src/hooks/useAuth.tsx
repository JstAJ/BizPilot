import * as React from "react";
import { db, ensureDefaultSettings } from "@/lib/db";
import { hashSecret, verifySecret } from "@/lib/crypto";
import { generateId } from "@/lib/utils";
import {
  getSession,
  saveSession,
  clearSession,
  lockSession,
  unlockSession,
  isLocked,
} from "@/lib/session";
import type { Session } from "@/types/auth";

interface AuthContextValue {
  isLoading: boolean;
  hasAccount: boolean;
  session: Session | null;
  locked: boolean;
  setupAccount: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  lock: () => void;
  unlockWithPin: (pin: string) => Promise<boolean>;
  unlockWithPassword: (password: string) => Promise<boolean>;
  setPin: (pin: string) => Promise<void>;
  disablePin: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasAccount, setHasAccount] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const [locked, setLocked] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    await ensureDefaultSettings();
    const count = await db.users.count();
    setHasAccount(count > 0);
    const s = getSession();
    setSession(s);
    setLocked(Boolean(s) && isLocked());
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const setupAccount = React.useCallback(async (username: string, password: string) => {
    const existing = await db.users.count();
    if (existing > 0) throw new Error("An account already exists on this device.");
    const passwordHash = await hashSecret(password);
    const user = {
      id: generateId("user"),
      username,
      passwordHash,
      pinEnabled: false,
      createdAt: Date.now(),
    };
    await db.users.put(user);
    const s = saveSession(user.id, user.username, true);
    setHasAccount(true);
    setSession(s);
    setLocked(false);
  }, []);

  const login = React.useCallback(
    async (username: string, password: string, rememberMe: boolean) => {
      const user = await db.users.where("username").equals(username).first();
      if (!user) throw new Error("Invalid username or password.");
      const ok = await verifySecret(password, user.passwordHash);
      if (!ok) throw new Error("Invalid username or password.");
      const s = saveSession(user.id, user.username, rememberMe);
      setSession(s);
      setLocked(false);
    },
    []
  );

  const logout = React.useCallback(async () => {
    clearSession();
    setSession(null);
    setLocked(false);
  }, []);

  const lock = React.useCallback(() => {
    lockSession();
    setLocked(true);
  }, []);

  const unlockWithPin = React.useCallback(
    async (pin: string) => {
      if (!session) return false;
      const user = await db.users.get(session.userId);
      if (!user?.pinHash) return false;
      const ok = await verifySecret(pin, user.pinHash);
      if (ok) {
        unlockSession();
        setLocked(false);
      }
      return ok;
    },
    [session]
  );

  const unlockWithPassword = React.useCallback(
    async (password: string) => {
      if (!session) return false;
      const user = await db.users.get(session.userId);
      if (!user) return false;
      const ok = await verifySecret(password, user.passwordHash);
      if (ok) {
        unlockSession();
        setLocked(false);
      }
      return ok;
    },
    [session]
  );

  const setPin = React.useCallback(
    async (pin: string) => {
      if (!session) return;
      const pinHash = await hashSecret(pin);
      await db.users.update(session.userId, { pinHash, pinEnabled: true });
    },
    [session]
  );

  const disablePin = React.useCallback(async () => {
    if (!session) return;
    await db.users.update(session.userId, { pinHash: undefined, pinEnabled: false });
  }, [session]);

  const changePassword = React.useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!session) throw new Error("Not authenticated.");
      const user = await db.users.get(session.userId);
      if (!user) throw new Error("User not found.");
      const ok = await verifySecret(currentPassword, user.passwordHash);
      if (!ok) throw new Error("Current password is incorrect.");
      const passwordHash = await hashSecret(newPassword);
      await db.users.update(session.userId, { passwordHash });
    },
    [session]
  );

  const value: AuthContextValue = {
    isLoading,
    hasAccount,
    session,
    locked,
    setupAccount,
    login,
    logout,
    lock,
    unlockWithPin,
    unlockWithPassword,
    setPin,
    disablePin,
    changePassword,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
