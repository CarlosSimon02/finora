import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  createRecurringBill,
  deleteRecurringBill,
  getDueSoonBills,
  getPaginatedRecurringBills,
  getPaidBills,
  getRecurringBill,
  getRecurringBillsSummary,
  getRecurringBillsTotalAmount,
  getUpcomingBills,
  payRecurringBill,
  updateRecurringBill,
} from "@/core/useCases/recurringBill";
import { RecurringBillRepository } from "@/data/repositories/RecurringBillRepository";
import { cacheTags } from "@/utils/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const recurringBillRepository = new RecurringBillRepository();

export const recurringBillsRouter = router({
  // Reads - cache where beneficial
  getPaginatedRecurringBills: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_RECURRING_BILLS);

      const { user } = ctx;
      const fn = getPaginatedRecurringBills(recurringBillRepository);
      return await fn(user.id, input);
    }),
  getRecurringBill: protectedProcedure
    .input((val: unknown) => val as { billId: string })
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = getRecurringBill(recurringBillRepository);
      return await fn(user.id, input.billId);
    }),
  getRecurringBillsSummary: protectedProcedure
    .input((val: unknown) => val as { offset?: any; dueSoon?: any })
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.RECURRING_BILLS_SUMMARY);

      const { user } = ctx;
      const fn = getRecurringBillsSummary(recurringBillRepository);
      return await fn(user.id, input.offset, input.dueSoon);
    }),
  getRecurringBillsTotalAmount: protectedProcedure
    .input((val: unknown) => val as { offset?: any })
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.RECURRING_BILLS_TOTALS);

      const { user } = ctx;
      const fn = getRecurringBillsTotalAmount(recurringBillRepository);
      return await fn(user.id, input.offset);
    }),
  getPaidBills: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.RECURRING_BILLS_PAID);

      const { user } = ctx;
      const fn = getPaidBills(recurringBillRepository);
      return await fn(user.id, input);
    }),
  getUpcomingBills: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.RECURRING_BILLS_UPCOMING);

      const { user } = ctx;
      const fn = getUpcomingBills(recurringBillRepository);
      return await fn(user.id, input);
    }),
  getDueSoonBills: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.RECURRING_BILLS_DUE_SOON);

      const { user } = ctx;
      const fn = getDueSoonBills(recurringBillRepository);
      // For now, use defaults for dueSoon and no offset from this endpoint
      return await fn(user.id, input, { daysBeforeDue: 2 });
    }),

  // Writes - mutations (no caching here)
  createRecurringBill: protectedProcedure
    .input(
      (val: unknown) =>
        val as { data: Parameters<ReturnType<typeof createRecurringBill>>[1] }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = createRecurringBill(recurringBillRepository);
      return await fn(user.id, input.data as any);
    }),
  updateRecurringBill: protectedProcedure
    .input(
      (val: unknown) =>
        val as {
          billId: string;
          data: Parameters<ReturnType<typeof updateRecurringBill>>[2];
        }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = updateRecurringBill(recurringBillRepository);
      return await fn(user.id, input.billId, input.data as any);
    }),
  deleteRecurringBill: protectedProcedure
    .input((val: unknown) => val as { billId: string })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = deleteRecurringBill(recurringBillRepository);
      await fn(user.id, input.billId);
      return undefined;
    }),
  payRecurringBill: protectedProcedure
    .input(
      (val: unknown) =>
        val as {
          billId: string;
          data: Parameters<ReturnType<typeof payRecurringBill>>[2];
        }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = payRecurringBill(recurringBillRepository);
      return await fn(user.id, input.billId, input.data as any);
    }),
});
