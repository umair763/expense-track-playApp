import { useState } from "react";
import { PageHeader } from "../common";
import { IncomeAddForm, IncomeTable, IncomeCard } from "../components";

export const Incomes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddSuccess = () => {
    window.dispatchEvent(new CustomEvent("incomeAdded"));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={["Dashboard", "Income"]}
        title="Incomes"
        subtitle="Manage and track all your incomes."
        buttonLabel="Add Income"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <IncomeCard />

      <IncomeTable />

      <IncomeAddForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};