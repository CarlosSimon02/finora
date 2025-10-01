import { HydrateClient } from "@/lib/trpc/server";
import { Overview } from "@/presentation/components/Features/Overview";

const OverviewPage = () => {
  return (
    <HydrateClient>
      <Overview />
    </HydrateClient>
  );
};

export default OverviewPage;
