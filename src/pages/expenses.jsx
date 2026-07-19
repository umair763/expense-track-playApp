import { useState } from "react";
import { PageHeader } from "../common";
import { ExpenseAddForm, ExpensesTable, ExpensePieChart } from "../components";

export const Expenses = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSuccess = () => {
    window.dispatchEvent(new CustomEvent("expenseAdded"));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={["Dashboard", "Expenses"]}
        title="Expenses"
        subtitle="Manage and track all your expenses."
        buttonLabel="Add Expense"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <ExpensePieChart />

      <ExpensesTable />

      <ExpenseAddForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};
