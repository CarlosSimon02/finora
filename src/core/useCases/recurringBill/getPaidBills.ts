import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  PaginationParams,
  RecurringBillsOffsetDto,
  RecurringBillsWithTotalsDto,
  paginationParamsSchema,
  recurringBillsOffsetSchema,
} from "@/core/schemas";
import { AuthError } from "@/utils";

export const getPaidBills =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (
    userId: string,
    params: PaginationParams,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto> => {
    if (!userId) throw new AuthError();
    const validatedParams = paginationParamsSchema.parse(params);
    const validatedOffset = offset
      ? recurringBillsOffsetSchema.parse(offset)
      : undefined;
    return recurringBillRepository.getPaid(
      userId,
      validatedParams,
      validatedOffset
    );
  };
