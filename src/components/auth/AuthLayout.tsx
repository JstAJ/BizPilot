import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";

export function AuthLayout({
  children,
  eyebrow,
}: {
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-5 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[38rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-72 w-72 rounded-full bg-gold-700/10 blur-[100px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-gold-400 to-gold-600 font-display text-lg font-bold text-black shadow-gold-glow">
            BP
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{eyebrow ?? APP_TAGLINE}</p>
        </div>

        <div className="glass-panel p-6 sm:p-7">{children}</div>
      </motion.div>
    </div>
  );
}
