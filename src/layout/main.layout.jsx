import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar, Footer } from '../layout'
import { SidebarProvider } from '../common/sidebar.context'

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <Navbar />

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  )
}
