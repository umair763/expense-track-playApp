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
        <div className="flex items-center gap-2">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-500"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
          )}
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || 'Guest'}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <UserIcon size={12} />
              {user?.email || 'Not signed in'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
