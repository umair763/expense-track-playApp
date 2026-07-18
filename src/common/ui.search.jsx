import { useState } from 'react'
import { Search, X } from 'lucide-react'

export const UiSearch = ({
  value,
  onChange,
  placeholder = 'Search...',
  showClearButton = true,
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState('')

  const isControlled = value !== undefined

  const searchValue = isControlled ? value : internalValue

  const handleChange = (e) => {
    if (isControlled) {
      onChange?.(e.target.value)
    } else {
      setInternalValue(e.target.value)
    }
  }

  const handleClear = () => {
    if (isControlled) {
      onChange?.('')
    } else {
      setInternalValue('')
    }
  }

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-12 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        {...props}
      />

      {showClearButton && searchValue.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}