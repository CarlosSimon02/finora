import { HydrateClient } from "@/lib/trpc/server";
import { Transactions } from "@/presentation/components/Features/Transactions";

const TransactionsPage = () => {
  return (
    <HydrateClient>
      <Transactions />
    </HydrateClient>
  );
};

export default TransactionsPage;
