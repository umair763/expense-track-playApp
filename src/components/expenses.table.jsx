import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../common/use.auth.jsx";
import { getExpenses, deleteExpense } from "../firebase/firestore.service.js";
import { UiPagination } from "../common/ui.pagination.jsx";
import { UiSearch } from "../common/ui.search.jsx";
import { ActionMenu } from "../common/action.menu.jsx";
import { UiLoading } from "../common/ui.loading.jsx";
import { UiStatusPill } from "../common/ui.status.phill.jsx";
import { UiDelete } from "../common/ui.delete.jsx";
import { ExpenseEditForm } from "./expense.edit.form.jsx";
import { ExpenseViewForm } from "./expense.view.form.jsx";

export const ExpensesTable = () => {
  const { user } = useAuth();

  const PAYMENT_METHOD_COLORS = {
    cash: "#22C55E",
    online: "#EAB308",
    bank: "#3B82F6",
    card: "#A855F7",
  };

  const PAYMENT_METHOD_LABELS = {
    cash: "Cash",
    online: "Online",
    bank: "Bank Transfer",
    card: "Credit/Debit Card",
  };

  const ROW_ACTIONS = [
    { key: "view", label: "View", variant: "filled" },
    { key: "edit", label: "Edit", variant: "outline" },
    { key: "delete", label: "Delete", variant: "danger" },
  ];

  const formatExpenseDate = (expenseDate) => {
    if (!expenseDate) return "N/A";
    const ms = expenseDate.seconds ? expenseDate.seconds * 1000 : expenseDate;
    return new Date(ms).toLocaleDateString();
  };

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [editModal, setEditModal] = useState({ open: false, item: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user?.id) {
        setExpenses([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const result = await getExpenses(user.id);
      if (cancelled) return;
      if (result.success) setExpenses(result.data);
      else console.error("Failed to fetch expenses:", result.error);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user?.id, refreshTick]);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  useEffect(() => {
    window.addEventListener("expenseAdded", refresh);
    return () => window.removeEventListener("expenseAdded", refresh);
  }, [refresh]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleView = (expense) => setViewModal({ open: true, item: expense });
  const handleEdit = (expense) => setEditModal({ open: true, item: expense });
  const handleDelete = (expense) => setDeleteModal({ open: true, item: expense });

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    const result = await deleteExpense(deleteModal.item.id);
    if (result.success) refresh();
    else alert("Failed to delete expense: " + result.error);
    setDeleteModal({ open: false, item: null });
  };

  const filteredExpenses = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return expenses;
    return expenses.filter(
      (e) =>
        e.title?.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query) ||
        e.category?.name?.toLowerCase().includes(query),
    );
  }, [expenses, searchQuery]);

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  return (
    <div className="w-full p-1 text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl text-[#4F30A9] font-bold">Expense Table</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <UiSearch
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Item", "Category", "Payment Method", "Amount", "Date"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-xs uppercase text-gray-500"
                    >
                      {col}
                    </th>
                  ),
                )}
                <th className="w-24 px-6 py-4 text-center text-xs uppercase text-gray-500">
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
                  const paymentMethod = expense.paymentMethod || "cash";
                  const color =
                    PAYMENT_METHOD_COLORS[paymentMethod] ?? PAYMENT_METHOD_COLORS.cash;
                  const label = PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod;

                  return (
                    <tr key={expense.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                        {expense.sequenceNumber || expense.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{expense.title}</td>
                      <td className="px-6 py-4">
                        <UiStatusPill
                          status={expense.category?.name || "Other"}
                          color="#3B82F6"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <UiStatusPill status={label} color={color} />
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {expense.currency || "PKR"}{" "}
                        {Number(expense.amount)?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatExpenseDate(expense.expenseDate)}
                      </td>
                      <td className="w-24 px-6 py-4">
                        <div className="flex w-full justify-center">
                          <ActionMenu
                            actions={ROW_ACTIONS}
                            onAction={(actionKey) => {
                              if (actionKey === "view") handleView(expense);
                              if (actionKey === "edit") handleEdit(expense);
                              if (actionKey === "delete") handleDelete(expense);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
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
        message={`Are you sure you want to delete expense ${
          deleteModal.item?.title || "Unnamed item"
        } #${deleteModal.item?.sequenceNumber || deleteModal.item?.id || "N/A"}`}
        confirmColor="#DC2626"
      />

      {/* Edit Modal */}
      <ExpenseEditForm
        open={editModal.open}
        onClose={() => setEditModal({ open: false, item: null })}
        expense={editModal.item}
        onSuccess={() => {
          refresh();
          window.dispatchEvent(new CustomEvent("expenseAdded"));
        }}
      />

      {/* View Modal */}
      <ExpenseViewForm
        open={viewModal.open}
        onClose={() => setViewModal({ open: false, item: null })}
        expense={viewModal.item}
      />
    </div>
  );
};
