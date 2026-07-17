import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.route.jsx'
import { AuthProvider } from './common'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
