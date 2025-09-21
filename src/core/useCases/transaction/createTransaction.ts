import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  CreateTransactionDto,
  TransactionDto,
  createTransactionSchema,
} from "@/core/schemas/transactionSchema";
import { AuthError } from "@/utils";

export const createTransaction =
  (transactionRepository: ITransactionRepository) =>
  async (
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto> => {
    if (!userId) throw new AuthError();

    const validatedTransaction = createTransactionSchema.parse(input);
    return transactionRepository.createOne(userId, validatedTransaction);
  };
