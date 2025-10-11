import {
  authRouter,
  budgetsRouter,
  incomesRouter,
  potsRouter,
  transactionsRouter,
} from "./routers";
import { mergeRouters, router } from "./trpc";

export const appRouter = mergeRouters(
  router({}),
  transactionsRouter,
  budgetsRouter,
  incomesRouter,
  potsRouter,
  authRouter
);

export type AppRouter = typeof appRouter;
