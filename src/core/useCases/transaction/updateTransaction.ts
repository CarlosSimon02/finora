import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  TransactionDto,
  UpdateTransactionDto,
  updateTransactionSchema,
} from "@/core/schemas/transactionSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const updateTransaction =
  (transactionRepository: ITransactionRepository) =>
  async (
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto> => {
    if (!userId) throw new AuthError();
    if (!transactionId)
      throw new DomainValidationError("Transaction ID is required");

    const validatedTransaction = updateTransactionSchema.parse(input);
    return transactionRepository.updateOne(
      userId,
      transactionId,
      validatedTransaction
    );
  };
