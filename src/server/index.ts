import { authRouter } from "./auth";
import { budgetsRouter } from "./budgets";
import { incomesRouter } from "./incomes";
import { potsRouter } from "./pots";
import { recurringBillsRouter } from "./recurringBills";
import { transactionsRouter } from "./transactions";
import { mergeRouters, router } from "./trpc";

export const appRouter = mergeRouters(
  router({}),
  transactionsRouter,
  budgetsRouter,
  incomesRouter,
  potsRouter,
  recurringBillsRouter,
  authRouter
);

export type AppRouter = typeof appRouter;
