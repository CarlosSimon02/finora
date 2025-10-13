import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { POT_DEFAULT_PER_PAGE } from "@/core/constants";
import { PaginationParams } from "@/core/schemas";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { Pots } from "@/presentation/components/Features/Pots";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";

type PotsPageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

const PotsPage = async ({ searchParams }: PotsPageProps) => {
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
      perPage: POT_DEFAULT_PER_PAGE,
    },
  };

  const tokens = await getTokens(await cookies(), authConfig);

  if (tokens) {
    trpc.getPaginatedPots.prefetch({ params });
    trpc.listUsedPotColors.prefetch();
    trpc.getPotsCount.prefetch();
  }

  return (
    <HydrateClient>
      <Pots />
    </HydrateClient>
  );
};

export default PotsPage;
