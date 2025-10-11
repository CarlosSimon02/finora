import { User } from "@/core/schemas";
import { createErrorFormatter } from "@/server/utils";
import { initTRPC } from "@trpc/server";
import { NextRequest } from "next/server";
import { cache } from "react";
import superjson from "superjson";

export type CreateNextContextOptions = {
  req: Request;
};

export type BaseContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type AuthedContext = BaseContext & { user: User };

export const createTRPCContext = cache(
  async (opts: CreateNextContextOptions) => {
    const nextReq = new NextRequest(opts.req.url, {
      headers: opts.req.headers,
      method: opts.req.method,
      body: opts.req.body,
    });

    return { req: nextReq };
  }
);

export const t = initTRPC.context<BaseContext>().create({
  transformer: superjson,
  errorFormatter: createErrorFormatter(),
});

export type Middleware = ReturnType<typeof t.middleware>;
