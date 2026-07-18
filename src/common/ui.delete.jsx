import { Trash2, X } from 'lucide-react'

export const UiDelete = ({
  open,
  onClose,
  onConfirm,
  title = 'Delete Item',
  itemType = 'item',
  itemName,
  fallbackName = 'this item',
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
  confirmColor = '#5B21B6',
}) => {
  if (!open) return null

  const displayMessage =
    message ||
    `Are you sure you want to delete the ${itemType} ${
      itemName || fallbackName
    }?`

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-5">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center justify-center px-8 py-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 size={24} />
          </div>

          <p className="text-sm font-medium leading-relaxed text-gray-700">
            {displayMessage}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-3 px-6 pb-7">
          <button
            type="button"
            onClick={onClose}
            className="h-10 min-w-[140px] cursor-pointer rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{ backgroundColor: confirmColor }}
            className="h-10 min-w-[140px] cursor-pointer rounded-lg px-4 text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.98]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
