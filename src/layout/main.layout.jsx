import { Outlet } from "react-router-dom";
import { Navbar, Sidebar, Footer } from "../layout";
import { SidebarProvider } from "../common/sidebar.context";

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#4F30A9]/7">
        <Sidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <Navbar />

          <div className="pt-16">
            <main className="p-6">
              <Outlet />
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};