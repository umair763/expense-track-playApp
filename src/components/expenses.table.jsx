import { useState, useEffect } from 'react'
import { useAuth } from '../common/use.auth.jsx'
import { getExpenses, deleteExpense } from '../firebase/firestore.service.js'
import { UiPagination } from '../common/ui.pagination.jsx'
import { UiSearch } from '../common/ui.search.jsx'
import { ActionButtons } from '../common/action.buttons.jsx'
import { UiLoading } from '../common/ui.loading.jsx'
import { UiStatusPill } from '../common/ui.status.phill.jsx'
import { UiDelete } from '../common/ui.delete.jsx'
import { ExpenseEditForm } from './expense.edit.form.jsx'
import { ExpenseViewForm } from './expense.view.form.jsx'

export const ExpensesTable = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null })
  const [editModal, setEditModal] = useState({ open: false, item: null })
  const [viewModal, setViewModal] = useState({ open: false, item: null })

  useEffect(() => {
    fetchExpenses()
  }, [user])

  useEffect(() => {
    const handleExpenseAdded = () => {
      fetchExpenses()
    }
    window.addEventListener('expenseAdded', handleExpenseAdded)
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded)
  }, [])

  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([])
      setLoading(false)
      return
    }

    setLoading(true)
    const result = await getExpenses(user.id)
    
    if (result.success) {
      setExpenses(result.data)
    } else {
      console.error('Failed to fetch expenses:', result.error)
    }
    
    setLoading(false)
  }

  const handleDelete = async (expenseId) => {
    const expense = expenses.find((exp) => exp.id === expenseId)
    setDeleteModal({ open: true, item: expense })
  }

  const handleEdit = (expense) => {
    setEditModal({ open: true, item: expense })
  }

  const handleView = (expense) => {
    setViewModal({ open: true, item: expense })
  }

  const confirmDelete = async () => {
    if (!deleteModal.item) return

    const result = await deleteExpense(deleteModal.item.id)
    if (result.success) {
      fetchExpenses()
    } else {
      alert('Failed to delete expense: ' + result.error)
    }
    setDeleteModal({ open: false, item: null })
  }

  const filteredExpenses = expenses.filter(expense =>
    expense.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="w-full p-5 bg-white text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#4A02F9] font-bold">
            Expense Records
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <UiSearch
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="sm:w-64"
          />
        </div>
      </div>

      {/* Expenses Table */}

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  #
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Item
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Payment Method
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8">
                    <UiLoading text="Loading expenses..." />
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map((expense) => {
                  const paymentMethodColors = {
                    cash: '#22C55E',
                    online: '#EAB308',
                    bank: '#3B82F6',
                    card: '#A855F7',
                  }
                  
                  const paymentMethodLabels = {
                    cash: 'Cash',
                    online: 'Online',
                    bank: 'Bank Transfer',
                    card: 'Credit/Debit Card',
                  }
                  
                  const paymentMethod = expense.paymentMethod || 'cash'
                  const color = paymentMethodColors[paymentMethod] || paymentMethodColors.cash
                  const label = paymentMethodLabels[paymentMethod] || paymentMethod

                  return (
                    <tr
                      key={expense.id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                        {expense.sequenceNumber || expense.id}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        {expense.title}
                      </td>

                      <td className="px-6 py-4">
                        <UiStatusPill
                          status={expense.category?.name || 'Other'}
                          color="#3B82F6"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <UiStatusPill
                          status={label}
                          color={color}
                        />
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {expense.currency || 'PKR'} {Number(expense.amount)?.toFixed(2) || '0.00'}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {expense.expenseDate ? new Date(expense.expenseDate.seconds ? expense.expenseDate.seconds * 1000 : expense.expenseDate).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ActionButtons
                          showView={true}
                          showEdit={true}
                          showDelete={true}
                          onView={() => handleView(expense)}
                          onEdit={() => handleEdit(expense)}
                          onDelete={() => handleDelete(expense.id)}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <UiPagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredExpenses.length}
        itemLabel="expense records"
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Delete Modal */}
      <UiDelete
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={confirmDelete}
        title="Delete Expense"
        itemType="expense"
        itemName={deleteModal.item?.title}
        message="Are you sure you want to delete this expense record?"
        confirmColor="#3B82F6"
      />

      {/* Edit Modal */}
      <ExpenseEditForm
        open={editModal.open}
        onClose={() => setEditModal({ open: false, item: null })}
        expense={editModal.item}
        onSuccess={() => {
          fetchExpenses()
          window.dispatchEvent(new CustomEvent('expenseAdded'))
        }}
      />

      {/* View Modal */}
      <ExpenseViewForm
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, item: null })}
        expense={viewModal.item}
      />
    </div>
  )
}
