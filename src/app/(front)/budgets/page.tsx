import { AppPageHeader } from "@/presentation/components/Features/PageHeader";

export default async function BudgetsPage() {
  return (
    <div className="flex flex-col gap-300">
      <AppPageHeader title="Budgets" />
      <div className="border-grey-800 rounded-lg border p-300">
        Budgets content
      </div>
    </div>
  );
}
