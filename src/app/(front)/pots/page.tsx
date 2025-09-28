import { AppPageHeader } from "@/presentation/components/Features/PageHeader";

export default async function PotsPage() {
  return (
    <div className="flex flex-col gap-300">
      <AppPageHeader title="Pots" />
      <div className="border-grey-800 rounded-lg border p-300">
        Pots content
      </div>
    </div>
  );
}
