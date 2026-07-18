import { ChevronLeft, ChevronRight } from 'lucide-react'

export const UiPagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  itemLabel = 'items',
  perPageOptions = [10, 20, 50, 100],
  onPageChange,
  onItemsPerPageChange,
}) => {
  const pageCount = Math.ceil(totalItems / itemsPerPage)

  const fromIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const toIndex = Math.min(currentPage * itemsPerPage, totalItems)

  const getPages = () => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }

    const pages = [1]

    if (currentPage > 3) pages.push('...')

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(pageCount - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < pageCount - 2) pages.push('...')

    pages.push(pageCount)

    return pages
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{fromIndex}</span>{' '}
        to <span className="font-semibold text-gray-900">{toIndex}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span>{' '}
        {itemLabel}
      </p>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">
        {/* <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option} / page
            </option>
          ))}
        </select> */}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center cursor-pointer justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          {getPages().map((page, index) =>
            page === '...' ? (
              <span
                key={index}
                className="px-2 text-sm font-medium text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 cursor-pointer text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-[#4A02F9] text-white shadow'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pageCount || pageCount === 0}
            className="flex h-9 w-9 items-center cursor-pointer justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
