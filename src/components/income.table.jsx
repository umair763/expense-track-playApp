import { useState, useEffect } from 'react'
import { useAuth } from '../common/use.auth.jsx'
import { getIncome, deleteIncome } from '../firebase/firestore.service.js'
import { UiPagination } from '../common/ui.pagination.jsx'
import { UiSearch } from '../common/ui.search.jsx'
import { ActionButtons } from '../common/action.buttons.jsx'
import { UiLoading } from '../common/ui.loading.jsx'
import { UiStatusPill } from '../common/ui.status.phill.jsx'
import { UiDelete } from '../common/ui.delete.jsx'
import { IncomeEditForm } from './income.edit.form.jsx'

export const IncomeTable = () => {
  const { user } = useAuth()
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null })
  const [editModal, setEditModal] = useState({ open: false, item: null })

  useEffect(() => {
    fetchIncome()
  }, [user])

  useEffect(() => {
    const handleIncomeAdded = () => {
      fetchIncome()
    }
    window.addEventListener('incomeAdded', handleIncomeAdded)
    return () => window.removeEventListener('incomeAdded', handleIncomeAdded)
  }, [])

  const fetchIncome = async () => {
    if (!user) {
      setIncomes([])
      setLoading(false)
      return
    }

    setLoading(true)
    console.log('Fetching income for user ID:', user.id)
    const result = await getIncome(user.id)

    console.log('Fetch result:', result)

    if (result.success) {
      console.log('Income data fetched:', result.data)
      setIncomes(result.data)
    } else {
      console.error('Failed to fetch income:', result.error)
    }

    setLoading(false)
  }

  const filteredIncomes = incomes.filter(
    (income) =>
      income.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.source?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const paginatedIncomes = filteredIncomes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = async (incomeId) => {
    const income = incomes.find((inc) => inc.id === incomeId)
    setDeleteModal({ open: true, item: income })
  }

  const handleEdit = (income) => {
    setEditModal({ open: true, item: income })
  }

  const confirmDelete = async () => {
    if (!deleteModal.item) return

    const result = await deleteIncome(deleteModal.item.id)
    if (result.success) {
      fetchIncome()
    } else {
      alert('Failed to delete income: ' + result.error)
    }
    setDeleteModal({ open: false, item: null })
  }

  return (
    <div className="w-full min-h-screen p-5 bg-white text-gray-900">
      {/* Header */}

      <div
        className="
            flex
            flex-col
            sm:flex-row
            justify-between
            gap-4
            mb-6
         "
      >
        <div>
          <h1
            className="
                  text-3xl
                  font-bold
                  text-[#4A02F9]
               "
          >
            Income Records
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <UiSearch
            placeholder="Search income..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="sm:w-64"
          />
        </div>
      </div>

      {/* Table */}

      <div
        className="
            rounded-xl
            overflow-hidden
            border
            border-gray-200
            bg-white/50
         "
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="
                     bg-gray-50
                  "
            >
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase text-gray-500">
                  Description
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

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8">
                    <UiLoading text="Loading income records..." />
                  </td>
                </tr>
              ) : filteredIncomes.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No income records found
                  </td>
                </tr>
              ) : (
                paginatedIncomes.map((income) => {
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
                  
                  const paymentMethod = income.paymentMethod || 'cash'
                  const color = paymentMethodColors[paymentMethod] || paymentMethodColors.cash
                  const label = paymentMethodLabels[paymentMethod] || paymentMethod

                  return (
                    <tr
                      key={income.id}
                      className="
                                border-t
                                border-gray-200
                                hover:bg-green-50
                             "
                    >
                      <td
                        className="
                                px-6
                                py-4
                                font-medium
                                text-gray-900
                             "
                      >
                        {income.title}
                      </td>

                      <td className="px-6 py-4">
                        <UiStatusPill
                          status={income.source?.name || 'Other'}
                          color="#22C55E"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <UiStatusPill
                          status={label}
                          color={color}
                        />
                      </td>

                      <td
                        className="
                                px-6
                                py-4
                                font-semibold
                                text-green-600
                             "
                      >
                        {income.currency || 'PKR'}{' '}
                        {Number(income.amount)?.toFixed(2) || '0.00'}
                      </td>

                      <td
                        className="
                                px-6
                                py-4
                                text-sm
                                text-gray-600
                             "
                      >
                        {income.incomeDate
                          ? new Date(
                              income.incomeDate.seconds
                                ? income.incomeDate.seconds * 1000
                                : income.incomeDate
                            ).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ActionButtons
                          showView={false}
                          showEdit={true}
                          showDelete={true}
                          onEdit={() => handleEdit(income)}
                          onDelete={() => handleDelete(income.id)}
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
        totalItems={filteredIncomes.length}
        itemLabel="income records"
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Delete Modal */}
      <UiDelete
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={confirmDelete}
        title="Delete Income"
        itemType="income"
        itemName={deleteModal.item?.title}
        message="Are you sure you want to delete this income record?"
        confirmColor="#22C55E"
      />

      {/* Edit Modal */}
      <IncomeEditForm
        open={editModal.open}
        onClose={() => setEditModal({ open: false, item: null })}
        income={editModal.item}
        onSuccess={() => {
          fetchIncome()
          window.dispatchEvent(new CustomEvent('incomeAdded'))
        }}
      />
    </div>
  )
}
