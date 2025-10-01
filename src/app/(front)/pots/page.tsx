import { HydrateClient } from "@/lib/trpc/server";
import { Pots } from "@/presentation/components/Features/Pots";

const PotsPage = () => {
  return (
    <HydrateClient>
      <Pots />
    </HydrateClient>
  );
};

export default PotsPage;
