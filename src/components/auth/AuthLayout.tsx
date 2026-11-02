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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Background ambient gold glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-80 w-80 rounded-full bg-gold-700/10 blur-[110px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-gold-400 to-gold-600 font-display text-lg font-bold text-black shadow-gold-glow border border-gold-300/40">
            BP
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{APP_NAME}</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{eyebrow ?? APP_TAGLINE}</p>
        </div>

        <div className="glass-panel p-6 sm:p-7 border-gold-500/25 shadow-xl">{children}</div>
      </motion.div>
    </div>
  );
}
