import { NavLink } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const { session, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-surface/40 px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 font-display text-sm font-bold text-black">
          BP
        </div>
        <div>
          <p className="font-display text-[15px] font-semibold leading-none">{APP_NAME}</p>
          <p className="mt-1 text-[11px] leading-none text-muted-foreground">{APP_TAGLINE}</p>
        </div>
      </div>

      <NavLink
        to={ROUTES.addExpense}
        className="mb-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 text-sm font-semibold text-black shadow-gold-glow transition-transform active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Add Expense
      </NavLink>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors",
                "hover:bg-surface-hover hover:text-foreground",
                isActive && "bg-gold-500/10 text-gold-400"
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">{session?.username}</p>
          <p className="text-[11px] text-muted-foreground">Signed in</p>
        </div>
        <button
          onClick={() => logout()}
          aria-label="Log out"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
