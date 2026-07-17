import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SidebarContext = createContext(null)

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const value = useMemo(
    () => ({
      collapsed,
      toggle: () => setCollapsed((c) => !c),
      isMobileOpen,
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
    }),
    [collapsed, isMobileOpen]
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider')
  return ctx
}
