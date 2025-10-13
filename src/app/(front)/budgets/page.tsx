import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { BUDGET_DEFAULT_PER_PAGE } from "@/core/constants";
import { PaginationParams } from "@/core/schemas";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { Budgets } from "@/presentation/components/Features/Budgets";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";

type BudgetsPageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

const BudgetsPage = async ({ searchParams }: BudgetsPageProps) => {
  const paramsResult = await searchParams;
  const page = Number.parseInt(paramsResult.page || "1", 10);

  const params: PaginationParams = {
    sort: {
      field: "createdAt",
      order: "desc",
    },
    filters: [],
    search: "",
    pagination: {
      page,
      perPage: BUDGET_DEFAULT_PER_PAGE,
    },
  };

  const tokens = await getTokens(await cookies(), authConfig);

  if (tokens) {
    trpc.getPaginatedBudgetsWithTransactions.prefetch({ params });
    trpc.getBudgetsCount.prefetch();
    trpc.getBudgetsSummary.prefetch();
  }

  return (
    <HydrateClient>
      <Budgets />
    </HydrateClient>
  );
};

export default BudgetsPage;
