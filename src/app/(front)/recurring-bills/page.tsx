import { HydrateClient } from "@/lib/trpc/server";
import { RecurringBills } from "@/presentation/components/Features/RecurringBills";

const RecurringBillsPage = () => {
  return (
    <HydrateClient>
      <RecurringBills />
    </HydrateClient>
  );
};

export default RecurringBillsPage;
