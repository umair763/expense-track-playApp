import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  TrendingDown,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useSidebar } from '../common/sidebar.context'
import { useAuth } from '../common'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/incomes', label: 'Incomes', icon: Wallet },
  { to: '/expenses', label: 'Expenses', icon: TrendingDown },
]

const linkBase =
  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors'

export const Sidebar = () => {
  const { collapsed, toggle, isMobileOpen, openMobile, closeMobile } =
    useSidebar()
  const { signout } = useAuth()

  const sidebarWidth = collapsed ? 'w-20' : 'w-64'
  const desktopTranslate = 'lg:translate-x-0'
  const mobileTranslate = isMobileOpen ? 'translate-x-0' : '-translate-x-full'
  const labelHidden = collapsed
    ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
    : 'opacity-100'

  return (
    <>
      <button
        type="button"
        onClick={openMobile}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-purple-600 text-white shadow"
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
        className={`fixed lg:static z-50 top-0 left-0 h-full ${sidebarWidth} bg-white shadow-lg flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out ${desktopTranslate} ${mobileTranslate}`}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span
            className={`font-bold text-lg text-purple-600 ${labelHidden} transition-all`}
          >
            💰 Expense Track
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggle}
              className="hidden lg:inline-flex p-2 rounded-md hover:bg-gray-100"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <Menu size={18} />
            </button>
            <button
              type="button"
              onClick={closeMobile}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-gray-700 hover:bg-purple-50'
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              <span
                className={`whitespace-nowrap transition-all ${labelHidden}`}
              >
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={signout}
            className={`${linkBase} w-full text-red-600 hover:bg-red-50`}
            title={collapsed ? 'Sign out' : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`whitespace-nowrap transition-all ${labelHidden}`}>
              Sign out
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
