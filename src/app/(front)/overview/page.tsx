import { HydrateClient, trpc } from "@/lib/trpc/server";
import { Overview } from "@/presentation/components/Features/Overview";

const OverviewPage = () => {
  trpc.getBudgetsSummary.prefetch();
  trpc.getIncomesSummary.prefetch();
  trpc.getPaginatedTransactions.prefetch({
    params: {
      pagination: { page: 1, perPage: 5 },
      sort: { field: "transactionDate", order: "desc" },
    },
  });
  trpc.getPotsSummary.prefetch({
    maxPotsToShow: 4,
  });

  return (
    <HydrateClient>
      <Overview />
    </HydrateClient>
  );
};

export default OverviewPage;
