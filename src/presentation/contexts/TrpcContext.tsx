import { trpc } from "@/lib/trpc/client";
import { makeQueryClient } from "@/lib/trpc/queryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

let clientQueryClientSingleton: QueryClient;
function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  return (clientQueryClientSingleton ??= makeQueryClient());
}

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `/api/trpc`,
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
