import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  DueSoonParamsDto,
  RecurringBillsOffsetDto,
  RecurringBillsSummaryDto,
  dueSoonParamsSchema,
  recurringBillsOffsetSchema,
} from "@/core/schemas";
import { AuthError } from "@/utils";

export const getRecurringBillsSummary =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (
    userId: string,
    offset?: RecurringBillsOffsetDto,
    dueSoon?: DueSoonParamsDto
  ): Promise<RecurringBillsSummaryDto> => {
    if (!userId) throw new AuthError();
    const validatedOffset = offset
      ? recurringBillsOffsetSchema.parse(offset)
      : undefined;
    const validatedDueSoon = dueSoon
      ? dueSoonParamsSchema.parse(dueSoon)
      : undefined;
    return recurringBillRepository.getSummary(
      userId,
      validatedOffset,
      validatedDueSoon
    );
  };
