import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from './layout'
import { Signin, Signup, Dashboard, Expenses, Incomes, Settings } from './pages'
import { ProtectedRoute, PublicRoute } from './common/protected.route'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/signin" replace />,
  },
  {
    path: '/signin',
    element: (
      <PublicRoute>
        <Signin />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'incomes', element: <Incomes /> },
      { path: 'settings', element: <Settings /> },
      
    ],
  },
  {
    path: '*',
    element: <Navigate to="/signin" replace />,
  },
])
