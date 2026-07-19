import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../common/use.auth.jsx";
import { getIncome, deleteIncome } from "../firebase/firestore.service.js";
import { UiPagination } from "../common/ui.pagination.jsx";
import { UiSearch } from "../common/ui.search.jsx";
import { ActionMenu } from "../common/action.menu.jsx";
import { UiLoading } from "../common/ui.loading.jsx";
import { UiStatusPill } from "../common/ui.status.phill.jsx";
import { UiDelete } from "../common/ui.delete.jsx";
import { IncomeEditForm } from "./income.edit.form.jsx";

export const IncomeTable = () => {
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
    { key: "edit", label: "Edit", variant: "filled" },
    { key: "delete", label: "Delete", variant: "danger" },
  ];

  const formatIncomeDate = (incomeDate) => {
    if (!incomeDate) return "N/A";
    const ms = incomeDate.seconds ? incomeDate.seconds * 1000 : incomeDate;
    return new Date(ms).toLocaleDateString();
  };

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [editModal, setEditModal] = useState({ open: false, item: null });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user?.id) {
        setIncomes([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const result = await getIncome(user.id);
      if (cancelled) return;
      if (result.success) setIncomes(result.data);
      else console.error("Failed to fetch income:", result.error);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user?.id, refreshTick]);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  useEffect(() => {
    window.addEventListener("incomeAdded", refresh);
    return () => window.removeEventListener("incomeAdded", refresh);
  }, [refresh]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleEdit = (income) => setEditModal({ open: true, item: income });
  const handleDelete = (income) => setDeleteModal({ open: true, item: income });

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    const result = await deleteIncome(deleteModal.item.id);
    if (result.success) refresh();
    else alert("Failed to delete income: " + result.error);
    setDeleteModal({ open: false, item: null });
  };

  const filteredIncomes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return incomes;
    return incomes.filter(
      (i) =>
        i.title?.toLowerCase().includes(query) ||
        i.description?.toLowerCase().includes(query) ||
        i.source?.name?.toLowerCase().includes(query),
    );
  }, [incomes, searchQuery]);

  const paginatedIncomes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIncomes.slice(start, start + itemsPerPage);
  }, [filteredIncomes, currentPage, itemsPerPage]);

  return (
    <div className="w-full min-h-screen p-2 text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-[#4F30A9]">Income Table</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <UiSearch
            placeholder="Search income..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Description", "Category", "Payment Method", "Amount", "Date"].map(
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
                    <UiLoading text="Loading income records..." />
                  </td>
                </tr>
              ) : filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No income records found
                  </td>
                </tr>
              ) : (
                paginatedIncomes.map((income) => {
                  const paymentMethod = income.paymentMethod || "cash";
                  const color =
                    PAYMENT_METHOD_COLORS[paymentMethod] ?? PAYMENT_METHOD_COLORS.cash;
                  const label = PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod;

                  return (
                    <tr key={income.id} className="hover:bg-green-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                        {income.sequenceNumber || income.id}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {income.title}
                      </td>

                      <td className="px-6 py-4">
                        <UiStatusPill
                          status={income.source?.name || "Other"}
                          color="#22C55E"
                        />
                      </td>

                      <td className="px-6 py-4">
                        <UiStatusPill status={label} color={color} />
                      </td>

                      <td className="px-6 py-4 font-semibold text-green-600">
                        {income.currency || "PKR"}{" "}
                        {Number(income.amount)?.toFixed(2) || "0.00"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatIncomeDate(income.incomeDate)}
                      </td>

                      <td className="w-24 px-6 py-4">
                        <div className="flex w-full justify-center">
                          <ActionMenu
                            actions={ROW_ACTIONS}
                            onAction={(actionKey) => {
                              if (actionKey === "edit") handleEdit(income);
                              if (actionKey === "delete") handleDelete(income);
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
        message={`Are you sure you want to delete income ${
          deleteModal.item?.title || "Unnamed item"
        } #${deleteModal.item?.sequenceNumber || deleteModal.item?.id || "N/A"}`}
        confirmColor="#DC2626"
      />

      {/* Edit Modal */}
      <IncomeEditForm
        open={editModal.open}
        onClose={() => setEditModal({ open: false, item: null })}
        income={editModal.item}
        onSuccess={() => {
          refresh();
          window.dispatchEvent(new CustomEvent("incomeAdded"));
        }}
      />
    </div>
  );
};
