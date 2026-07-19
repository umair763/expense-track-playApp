import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'

export const ActionMenu = ({ actions = [], onAction }) => {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  // Recalculate position every time the menu opens
  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.right + window.scrollX,
      })
    }
    setOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e) => {
      const clickedTrigger = triggerRef.current?.contains(e.target)
      const clickedMenu = menuRef.current?.contains(e.target)

      if (!clickedTrigger && !clickedMenu) {
        setOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    // Close on scroll so the menu doesn't float away from its row
    const handleScroll = () => setOpen(false)

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('scroll', handleScroll, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [open])

  const handleSelect = (key) => {
    setOpen(false)
    onAction?.(key)
  }

  const variantClasses = {
    filled:  'bg-[#4F30A9] border-[#4F30A9] text-white hover:bg-[#3d01d2]',
    outline: 'bg-white border-[#4F30A9] text-[#4F30A9] hover:bg-[#4F30A9]/5',
    danger:  'bg-white border-[#4F30A9] text-[#4F30A9] hover:bg-red-50 hover:border-red-500 hover:text-red-500',
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleOpen}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:border-[#4F30A9] hover:text-[#4F30A9]"
      >
        <MoreVertical size={20} />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: 'absolute',
            top: menuPos.top,
            left: menuPos.left,
            transform: 'translateX(-100%)',
            zIndex: 9999,
          }}
          className="flex w-30 flex-col gap-2 rounded-lg bg-white p-2 shadow-lg"
        >
          {actions.map((a) => {
            const Icon = a.icon
            return (
              <button
                key={a.key}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(a.key)}
                className={`flex w-full cursor-pointer items-center justify-center rounded-lg border-1 px-3 py-1 text-sm font-bold transition ${
                  variantClasses[a.variant || 'outline']
                }`}
              >
                {Icon && <Icon size={15} className="shrink-0" />}
                {a.label}
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </>
  )
}