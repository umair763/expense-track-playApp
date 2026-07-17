import { Outlet } from 'react-router-dom'
import { Navbar, Sidebar, Footer } from '../layout'
import { SidebarProvider } from '../common/sidebar.context'

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-gray-50 text-gray-900 flex flex-col">
        <Navbar />
        <div className="flex flex-1 min-h-0">
          <Sidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <main className="flex-1 p-5 lg:p-6 w-full min-w-0 overflow-y-auto">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
