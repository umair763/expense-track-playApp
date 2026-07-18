import { User as UserIcon } from 'lucide-react'
import { useAuth } from '../common'

export const Navbar = () => {
  const { user } = useAuth()
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-end gap-3 px-4 py-3 pl-16 lg:pl-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || 'Guest'}
            </p>
          </div>

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-xl border-2 border-purple-500 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-sm font-semibold text-white">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
