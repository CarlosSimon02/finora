import { AppPageHeader } from "@/presentation/components/Features/PageHeader";

export default async function TransactionsPage() {
  return (
    <div className="flex flex-col gap-300">
      <AppPageHeader title="Transactions" />
      <div className="border-grey-800 rounded-lg border p-300">
        Transactions content
      </div>
    </div>
  );
}
