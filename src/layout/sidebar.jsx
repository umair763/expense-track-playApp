import { NavLink } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Wallet,
  TrendingDown,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { useSidebar } from "../common/sidebar.context";
import { useAuth } from "../common";
import { LogoutDialogue } from "../components/logout.dialogue";

// NOTE: adjust these two import paths to wherever getIncome / getExpenses
// actually live in your project (same functions used in IncomeTable / ExpensesTable).
import { getIncome } from "../firebase/firestore.service";
import { getExpenses } from "../firebase/firestore.service";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/incomes", label: "Incomes", icon: Wallet },
  { to: "/expenses", label: "Expenses", icon: TrendingDown },
];

const linkBase =
  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

const formatCurrency = (value, currency = "PKR") => {
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
};

export const Sidebar = () => {
  const { collapsed, toggle, isMobileOpen, openMobile, closeMobile } = useSidebar();
  const { signout, user } = useAuth();
  const [showLogoutDialogue, setShowLogoutDialogue] = useState(false);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [summaryLoading, setSummaryLoading] = useState(true);

  const sidebarWidth = collapsed ? "w-16" : "w-72";
  const desktopTranslate = "lg:translate-x-0";
  const mobileTranslate = isMobileOpen ? "translate-x-0" : "-translate-x-full";
  const labelHidden = collapsed
    ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
    : "opacity-100";
  const blockHidden = collapsed ? "lg:hidden" : "";

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user?.id) {
        setSummaryLoading(false);
        return;
      }
      setSummaryLoading(true);
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          getIncome(user.id),
          getExpenses(user.id),
        ]);
        if (cancelled) return;
        const incomeTotal = incomeRes?.success
          ? incomeRes.data.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
          : 0;
        const expenseTotal = expenseRes?.success
          ? expenseRes.data.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
          : 0;
        setSummary({ income: incomeTotal, expense: expenseTotal });
      } catch (err) {
        console.error("Failed to load sidebar summary:", err);
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    };
    run();

    const refresh = () => run();
    window.addEventListener("incomeAdded", refresh);
    window.addEventListener("expenseAdded", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("incomeAdded", refresh);
      window.removeEventListener("expenseAdded", refresh);
    };
  }, [user?.id]);

  const balance = useMemo(() => summary.income - summary.expense, [summary]);
  const currency = user?.currency || "PKR";

  const handleLogoutClick = () => setShowLogoutDialogue(true);
  const handleLogoutConfirm = () => {
    setShowLogoutDialogue(false);
    signout();
  };
  const handleLogoutCancel = () => setShowLogoutDialogue(false);

  return (
    <>
      <button
        type="button"
        onClick={openMobile}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-[#4F30A9] cursor-pointer text-white shadow"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={closeMobile}
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`fixed lg:sticky lg:top-0 lg:self-start z-50 top-0 left-0 h-screen ${sidebarWidth} bg-[#000C1D] text-white shadow-lg flex flex-col border-r border-white/10 transition-all duration-300 ease-in-out ${desktopTranslate} ${mobileTranslate}`}
        aria-label="Sidebar navigation"
      >
        {/* Brand header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div
            className={`flex items-center gap-2 ${labelHidden} transition-all overflow-hidden`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#4F30A9] flex items-center justify-center shrink-0">
              <Wallet size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white whitespace-nowrap">
              Expense Track
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggle}
              className="hidden cursor-pointer lg:inline-flex p-2 rounded-md hover:bg-white/10"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand" : "Collapse"}
            >
              <Menu size={18} />
            </button>
            <button
              type="button"
              onClick={closeMobile}
              className="lg:hidden p-2 rounded-md hover:bg-white/10 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className={`p-3 space-y-2 ${blockHidden}`}>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">
              Current Balance
            </p>
            <p
              className={`text-xl font-bold ${
                balance >= 0 ? "text-white" : "text-red-400"
              }`}
            >
              {summaryLoading ? "—" : formatCurrency(balance, currency)}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-2 py-1.5">
                <TrendingUp size={14} className="text-green-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-white/40 leading-none">Income</p>
                  <p className="text-xs font-semibold text-green-400 truncate">
                    {summaryLoading ? "—" : formatCurrency(summary.income, currency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-2 py-1.5">
                <TrendingDown size={14} className="text-red-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-white/40 leading-none">Expenses</p>
                  <p className="text-xs font-semibold text-red-400 truncate">
                    {summaryLoading ? "—" : formatCurrency(summary.expense, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-3 my-2 h-px bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-[#4F30A9] text-white shadow"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              <span className={`whitespace-nowrap transition-all ${labelHidden}`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="space-y-1.5 p-3">
          <NavLink
            to="/settings"
            onClick={closeMobile}
            className={`${linkBase} text-white/80 hover:bg-white/10 hover:text-white`}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings size={20} className="shrink-0" />
            <span className={`whitespace-nowrap transition-all ${labelHidden}`}>
              Settings
            </span>
          </NavLink>
          <div className="my-2 h-px w-full bg-white/10" />
          <button
            type="button"
            onClick={handleLogoutClick}
            className={`${linkBase} w-full cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300`}
            title={collapsed ? "Sign out" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`whitespace-nowrap transition-all ${labelHidden}`}>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      <LogoutDialogue
        open={showLogoutDialogue}
        onClose={handleLogoutCancel}
        onLogout={handleLogoutConfirm}
      />
    </>
  );
};
