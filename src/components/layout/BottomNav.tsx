import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const left = NAV_ITEMS.slice(0, 2);
  const right = NAV_ITEMS.slice(2);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 px-3 pb-3">
        <div className="glass-panel flex flex-1 items-center justify-around rounded-2xl py-1.5 shadow-glass">
          {left.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}

          <div className="w-14" />

          {right.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
      </div>

      <NavLink
        to={ROUTES.addExpense}
        aria-label="Add expense"
        className="absolute bottom-5 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-black shadow-gold-glow transition-transform active:scale-95"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </NavLink>
    </nav>
  );
}

function NavItem({
  path,
  label,
  icon: Icon,
}: (typeof NAV_ITEMS)[number]) {
  return (
    <NavLink
      to={path}
      className="relative flex flex-1 flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] font-medium text-muted-foreground"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="bottom-nav-pill"
              className="absolute -top-1 h-1 w-5 rounded-full bg-gold-500"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon
            className={cn("h-5 w-5 transition-colors", isActive && "text-gold-400")}
            strokeWidth={isActive ? 2.4 : 2}
          />
          <span className={cn(isActive && "text-gold-400")}>{label}</span>
        </>
      )}
    </NavLink>
  );
}
