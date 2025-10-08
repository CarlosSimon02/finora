import { TRANSACTION_DEFAULT_PER_PAGE } from "@/core/constants";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { Transactions } from "@/presentation/components/Features/Transactions";
import { parseSearchParams } from "@/utils";

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const paramsResult = await searchParams;

  const params = parseSearchParams(paramsResult, {
    defaultPage: 1,
    defaultPerPage: TRANSACTION_DEFAULT_PER_PAGE,
    defaultSort: {
      field: "transactionDate",
      order: "desc",
    },
  });

  trpc.getPaginatedTransactions.prefetch(params);

  await trpc.getPaginatedCategories.prefetch({
    sort: { field: "name", order: "asc" },
    pagination: { page: 1, perPage: 30 },
    filters: [],
    search: "",
  });

  return (
    <HydrateClient>
      <Transactions />
    </HydrateClient>
  );
};

export default TransactionsPage;
