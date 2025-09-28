import { AppPageHeader } from "@/presentation/components/Features/PageHeader";

export default async function RecurringBillsPage() {
  return (
    <div className="flex flex-col gap-300">
      <AppPageHeader title="Recurring Bills" />
      <div className="border-grey-800 rounded-lg border p-300">
        Recurring Bills content
      </div>
    </div>
  );
}
