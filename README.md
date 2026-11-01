# BizPilot — Simple Business. Smart Decisions.

A premium, **offline-first** business expense management app for manufacturers and small
businesses. Built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui-style components,
Framer Motion, Recharts, and Dexie.js (IndexedDB). No backend. No account server. Everything
lives on the device, and it installs as a PWA on Android, iPhone, tablet, and desktop.

**Version:** 1.0.0 (V1.0)

---

## 1. Tech Stack

| Layer            | Choice                                                        |
|-------------------|----------------------------------------------------------------|
| Framework         | React 18 + TypeScript + Vite 6                                |
| Styling           | Tailwind CSS 3 + CSS variables (light/dark theme tokens)       |
| Components        | Hand-built shadcn/ui-style primitives on Radix UI primitives   |
| Animation         | Framer Motion                                                  |
| Routing           | React Router 7                                                 |
| Forms             | React Hook Form + Zod                                          |
| Charts            | Recharts                                                        |
| Local database    | Dexie.js (IndexedDB) + dexie-react-hooks (live queries)         |
| Notifications     | Sonner (toasts)                                                |
| PWA               | vite-plugin-pwa (installable, offline-capable, auto-update)    |

---

## 2. Folder Structure

```
bizpilot/
├── public/
│   └── icons/                  # Generated PWA icons + favicon (black/gold monogram)
├── src/
│   ├── app/
│   │   ├── providers.tsx       # Composes Router + Theme + Auth + Toaster
│   │   └── router.tsx          # Route tree + auth gates (GuestRoute / ProtectedRoute)
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable primitives: Button, Card, Dialog, Select…
│   │   ├── layout/              # AppShell, Sidebar (desktop), BottomNav (mobile), TopBar
│   │   ├── auth/                 # AuthLayout, LoginForm, SetupForm, PinPad
│   │   ├── dashboard/           # SummaryCard, charts, RecentExpensesList, GreetingHeader
│   │   ├── expenses/            # ExpenseForm, ExpenseCard, ExpenseFilters, BillPhotoUpload
│   │   ├── reports/              # ReportSummaryCards, CategoryReportTable, ExportButtons
│   │   ├── settings/             # ThemeToggle, PinLockSettings, BackupRestore, AboutApp
│   │   └── shared/               # EmptyState, ConfirmDialog, PageHeader, skeletons
│   │
│   ├── pages/                   # One file per route (Dashboard, Expenses, Reports, Settings…)
│   ├── hooks/                   # useAuth, useTheme, useExpenses, useSettings,
│   │                             # useDashboardStats, useReports, useDebounce
│   ├── lib/
│   │   ├── db.ts                 # Dexie schema — single source of truth for persistence
│   │   ├── crypto.ts             # SHA-256 password/PIN hashing (Web Crypto API)
│   │   ├── currency.ts           # ₹ formatting helpers
│   │   ├── date.ts               # date-fns based helpers, date ranges
│   │   ├── session.ts            # localStorage session + lock state
│   │   ├── utils.ts              # cn(), id generation, CSV/JSON download
│   │   └── validation/           # Zod schemas (auth, expense forms)
│   │
│   ├── types/                    # Domain types: Expense, User, Session, Settings
│   ├── constants/                 # Categories, routes, nav items, app metadata
│   ├── index.css                  # Design tokens (black/white/gold, light + dark)
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── tailwind.config.ts
├── vite.config.ts                 # Includes PWA manifest + manual chunk splitting
├── tsconfig*.json
└── package.json
```

**Why this structure:** each domain (auth, expenses, dashboard, reports, settings) owns its
own component folder, so a feature's UI, hooks, and validation live near each other without
duplicating logic. `lib/` holds framework-agnostic logic (the database, crypto, formatting)
that has zero React dependency — this is what would survive a future migration to a backend
or a different UI layer.

---

## 3. Architecture Notes

### Data layer (`lib/db.ts`)
A single Dexie database (`bizpilot-db`) with five tables: `users`, `expenses`, `dailySales`,
`financeSettings`, `appSettings`. All reads in the UI go through `dexie-react-hooks`'
`useLiveQuery`, so **every screen updates instantly and automatically** when data changes
anywhere in the app — no manual refetching, no stale state.

### Auth (`hooks/useAuth.tsx`)
Since there's no backend in V1, accounts are created locally on first launch (`/setup`).
Passwords and PINs are hashed with SHA-256 via the Web Crypto API before being stored in
IndexedDB (`lib/crypto.ts`) — this guards against casually reading the database, not against
a determined local attacker with full device access, which no client-only app can prevent.
Sessions live in `localStorage` with an expiry (30 days if "Remember Me" is checked, 12 hours
otherwise). A separate `locked` flag lets a session stay valid while requiring the PIN pad —
this is what powers the "Lock App" action in the account menu and, in a future version, an
idle-timeout auto-lock.

### Theming (`hooks/useTheme.tsx`)
Theme preference (`light` / `dark` / `system`) is persisted in Dexie, not `localStorage`, so
it's included automatically in Backup/Restore. CSS variables in `index.css` define the full
black/white/gold palette for both modes; Tailwind's `dark:` variant and the `.dark` class on
`<html>` do the rest.

### The one signature detail
Every currency figure in the app — dashboard cards, expense rows, report tables — renders in
`JetBrains Mono` with tabular numerals (the `.num` utility class). It's a small thing, but it
makes every number in the app read like a ledger entry, which is exactly the feeling a
business-finance tool should have.

### Forms
Every form (login, setup, add/edit expense, change password) follows the same pattern:
Zod schema → `zodResolver` → React Hook Form → typed `onSubmit`. Validation messages are
inline and accessible; there are no native `alert()`s anywhere in the app.

---

## 4. Feature Coverage

- **Auth**: local account setup, login with Remember Me, 4-digit PIN lock (separate from
  password), manual "Lock App" action, change password, full session expiry handling.
- **Dashboard**: live greeting, 6 summary cards (Sales/Expense/Profit/Cash/Bank/Emergency
  Fund — the finance figures are tap-to-edit), category pie chart, 30-day area chart, 6-month
  bar chart, recent expenses, quick-add action.
- **Expenses**: full CRUD, bill photo capture/upload (stored as base64 in IndexedDB), search,
  filter by category/payment method, sort by date/amount/category, delete confirmation.
- **Reports**: Daily / Weekly / Monthly tabs, summary cards (total, count, average, highest),
  category breakdown table, working CSV export (PDF export is stubbed with a toast — see
  Roadmap).
- **Settings**: theme switcher, PIN lock toggle with create/confirm flow, change password,
  JSON backup/restore (full database round-trip), about/version info, log out.
- **UX polish**: page transitions, loading skeletons (not spinners) on every async screen,
  toast notifications for every mutation, empty states with a clear next action, confirmation
  dialogs before every destructive action.

---

## 5. How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
# → opens on http://localhost:5173

# 3. Type-check + build for production
npm run build
# → outputs to /dist, including the PWA service worker and manifest

# 4. Preview the production build locally
npm run preview
```

**First launch:** the app opens on `/setup` since there's no account yet. Create a username
and password — you're immediately signed in. From Settings you can then turn on a PIN lock
for faster unlocking on future visits.

**Installing as a PWA:** after `npm run build && npm run preview` (or deploying `/dist`
anywhere with HTTPS), use "Add to Home Screen" on Android/iPhone or the install icon in
Chrome/Edge on desktop. The app will then launch full-screen and work with no network
connection.

**Note on demo data:** V1 ships with zero seeded data by design — every number on the
dashboard is real, computed from what you enter, so nothing is decorative or fake.

---

## 6. Future Improvements (V1.1+)

- **Cloud sync** — an optional backend (e.g. Supabase/Postgres) for multi-device sync,
  keeping local-first IndexedDB as the offline cache layer rather than replacing it.
- **PDF export** for reports and individual expenses (jsPDF is already a natural fit given
  the CSV export pattern already in `ExportButtons`).
- **Recurring expenses** (e.g. monthly salary, rent) that auto-generate on schedule.
- **Multi-user / roles** — staff accounts with restricted permissions once a backend exists.
- **Sales module** — right now "Today's Sales" is a single manually-entered figure per day;
  a full sales-entry flow (line items, customers) would let profit be computed automatically
  rather than requiring manual input.
- **Budgets & alerts** — per-category monthly budgets with over-budget notifications.
- **Idle auto-lock** — the constant `AUTO_LOCK_IDLE_MS` already exists in
  `constants/app.ts`; wiring a real idle timer to call `lock()` is a small follow-up.
- **Data virtualization** for the expense list once a business has thousands of records.
- **Automated tests** — Vitest for hooks/lib, Playwright for the auth and expense flows.

---

## 7. Verification

This project was scaffolded and verified in a real environment, not just written:

- `npm install` — 616 packages installed cleanly.
- `npx tsc -b` — zero type errors across the full codebase.
- `npx vite build` — production build succeeds, generates a service worker, manifest, and
  code-split chunks (react-vendor, charts, motion, radix, forms, db).
- `npx vite` (dev server) — boots and serves the module graph correctly.
