import { POT_DEFAULT_PER_PAGE } from "@/core/constants";
import { PaginationParams } from "@/core/schemas";
import { HydrateClient, trpc } from "@/lib/trpc/server";
import { Pots } from "@/presentation/components/Features/Pots";

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

  trpc.getPaginatedPots.prefetch(params);
  // trpc.listUsedPotColors.prefetch();

  return (
    <HydrateClient>
      <Pots />
    </HydrateClient>
  );
};

export default PotsPage;
