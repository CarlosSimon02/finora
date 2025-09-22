import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  DueSoonParamsDto,
  PaginationParams,
  RecurringBillsOffsetDto,
  RecurringBillsWithTotalsDto,
  dueSoonParamsSchema,
  paginationParamsSchema,
  recurringBillsOffsetSchema,
} from "@/core/schemas";
import { AuthError } from "@/utils";

export const getDueSoonBills =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (
    userId: string,
    params: PaginationParams,
    dueSoonParams: DueSoonParamsDto,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto> => {
    if (!userId) throw new AuthError();
    const validatedParams = paginationParamsSchema.parse(params);
    const validatedDueSoon = dueSoonParamsSchema.parse(dueSoonParams);
    const validatedOffset = offset
      ? recurringBillsOffsetSchema.parse(offset)
      : undefined;
    return recurringBillRepository.getDueSoon(
      userId,
      validatedParams,
      validatedDueSoon,
      validatedOffset
    );
  };
