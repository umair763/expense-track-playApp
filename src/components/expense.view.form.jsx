import { X } from 'lucide-react'
import { UiStatusPill } from '../common/ui.status.phill.jsx'

export const ExpenseViewForm = ({ open, onClose, expense }) => {
  if (!open || !expense) return null

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAmount = (amount, currency) => {
    return `${currency || 'PKR'} ${parseFloat(amount).toLocaleString()}`
  }

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Cash',
      online: 'Online',
      bank: 'Bank Transfer',
      card: 'Credit/Debit Card'
    }
    return labels[method] || method
  }

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1050] p-4">
      <div className="bg-white rounded-xl overflow-hidden flex flex-col w-full max-w-[800px] max-h-[90vh] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#4A02F9] rounded-t-xl flex-shrink-0">
          <h2 className="text-[15px] font-semibold text-white leading-[1.4] m-0">
            Expense Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-7 h-7 p-0 border-none bg-transparent text-white/85 cursor-pointer rounded-lg transition-all hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
  <div className="space-y-6">

    {/* Category + Expense */}
    <div className="flex flex-wrap gap-3">
      <UiStatusPill
        status={expense.category?.name || 'N/A'}
        color="#9333EA"
      />
      <UiStatusPill
        status={expense.title || 'N/A'}
        color="#3B82F6"
      />
    </div>

    {/* Amount Highlight */}
    <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
        Total Amount
      </p>

      <h3 className="mt-2 text-3xl font-bold text-[#09090B]">
        {formatAmount(expense.amount, expense.currency)}
      </h3>
    </div>

    {/* Description */}
    {expense.description && (
      <div>
        <h4 className="text-sm font-semibold text-[#374151] mb-2">
          Description
        </h4>

        <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
          <p className="text-[15px] leading-7 text-[#4B5563]">
            {expense.description}
          </p>
        </div>
      </div>
    )}

    {/* Details */}
    <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">

      <div className="px-5 py-4 border-b bg-[#FAFAFA]">
        <h4 className="text-sm font-semibold text-[#374151]">
          Expense Information
        </h4>
      </div>

      <div className="grid grid-cols-2">

        <div className="p-5 border-r border-b">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">
            Recorded Date
          </p>

          <p className="mt-2 text-[15px] font-medium text-[#111827]">
            {formatDate(expense.expenseDate)}
          </p>
        </div>

        <div className="p-5 border-b">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">
            Payment Method
          </p>

          <p className="mt-2 text-[15px] font-medium text-[#111827]">
            {getPaymentMethodLabel(expense.paymentMethod)}
          </p>
        </div>

        <div className="p-5 border-r">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">
            Currency
          </p>

          <p className="mt-2 text-[15px] font-medium text-[#111827]">
            {expense.currency || 'PKR'}
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-wide text-[#6B7280]">
            Record #
          </p>

          <p className="mt-2 text-[15px] font-medium text-[#111827]">
            {expense.sequenceNumber || 'N/A'}
          </p>
        </div>

      </div>
    </div>

  </div>
</div>

        {/* Divider */}
        <div className="h-px bg-[#E4E7EC] mx-6 flex-shrink-0"></div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 min-w-[90px] px-5 rounded-lg font-sans text-sm font-medium text-white border-none bg-[#4A02F9] cursor-pointer transition-all hover:bg-[#4A02F9]/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
