import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  CreateRecurringBillDto,
  RecurringBillDto,
  createRecurringBillSchema,
} from "@/core/schemas";
import { AuthError, ConflictError } from "@/utils/errors";

export const createRecurringBill =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (
    userId: string,
    input: CreateRecurringBillDto
  ): Promise<RecurringBillDto> => {
    if (!userId) throw new AuthError();

    const validated = createRecurringBillSchema.parse(input);
    const existing = await recurringBillRepository.getOneByName(
      userId,
      validated.name
    );
    if (existing) throw new ConflictError("Recurring bill name already exists");
    return recurringBillRepository.createOne(userId, validated);
  };
