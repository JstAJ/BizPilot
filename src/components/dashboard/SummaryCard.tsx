import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { formatCompactINR } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: LucideIcon;
  tone?: "default" | "success" | "danger" | "gold";
  delay?: number;
  onClick?: () => void;
}

const toneStyles: Record<NonNullable<SummaryCardProps["tone"]>, string> = {
  default: "text-foreground",
  success: "text-success",
  danger: "text-danger",
  gold: "text-gold-400",
};

export function SummaryCard({ label, amount, icon: Icon, tone = "default", delay = 0, onClick }: SummaryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn(
        "glass-panel flex flex-col gap-2.5 p-4 text-left transition-transform",
        onClick && "cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Icon className={cn("h-4 w-4", toneStyles[tone])} />
      </div>
      <span className={cn("num text-xl font-semibold sm:text-2xl", toneStyles[tone])}>
        {formatCompactINR(amount)}
      </span>
    </motion.button>
  );
}
