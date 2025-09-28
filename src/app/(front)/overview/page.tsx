import { AppPageHeader } from "@/presentation/components/Features/PageHeader";

export default async function OverviewPage() {
  return (
    <div className="flex flex-col gap-300">
      <AppPageHeader title="Overview" />
      <div className="border-grey-800 rounded-lg border p-300">
        Overview content
      </div>
    </div>
  );
}
