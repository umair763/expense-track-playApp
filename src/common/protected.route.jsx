import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './use.auth.jsx'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }
  return children
}

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
