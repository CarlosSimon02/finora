import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { INCOME_DEFAULT_PER_PAGE } from "@/core/constants";
import { PaginationParams } from "@/core/schemas";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { Incomes } from "@/presentation/components/Features/Incomes/Incomes";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";

type IncomesPageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

const IncomesPage = async ({ searchParams }: IncomesPageProps) => {
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
      perPage: INCOME_DEFAULT_PER_PAGE,
    },
  };

  const tokens = await getTokens(await cookies(), authConfig);

  if (tokens) {
    trpc.getPaginatedIncomesWithTransactions.prefetch({ params });
    trpc.getIncomesCount.prefetch();
    trpc.getIncomesSummary.prefetch();
  }

  return (
    <HydrateClient>
      <Incomes />
    </HydrateClient>
  );
};

export default IncomesPage;
