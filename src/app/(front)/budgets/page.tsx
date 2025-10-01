import { HydrateClient } from "@/lib/trpc/server";
import { Budgets } from "@/presentation/components/Features/Budgets";

const BudgetsPage = () => {
  return (
    <HydrateClient>
      <Budgets />
    </HydrateClient>
  );
};

export default BudgetsPage;
