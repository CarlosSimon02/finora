import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  PaginatedRecurringBillsResponseDto,
  PaginationParams,
  paginationParamsSchema,
} from "@/core/schemas";
import { AuthError } from "@/utils";

export const getPaginatedRecurringBills =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedRecurringBillsResponseDto> => {
    if (!userId) throw new AuthError();
    const validated = paginationParamsSchema.parse(params);
    return recurringBillRepository.getPaginated(userId, validated);
  };
