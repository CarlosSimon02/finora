"use server";

import { env } from "@/config/env";
import { appRouter } from "@/server";
import { createTRPCContext } from "@/server/init";
import { createCallerFactory } from "@/server/trpc";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";
import { makeQueryClient } from "./queryClient";

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(async () => {
  const context = await createTRPCContext({
    req: new NextRequest(env.NEXT_PUBLIC_SITE_URL, {
      headers: await headers(),
    }),
  });
  return context;
});

const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);

export { HydrateClient, trpc };
