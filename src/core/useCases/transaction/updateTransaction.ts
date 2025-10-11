import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  TransactionDto,
  UpdateTransactionDto,
  updateTransactionSchema,
} from "@/core/schemas/transactionSchema";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const updateTransaction = (
  transactionRepository: ITransactionRepository
) => {
  const useCase = async (
    userId: string,
    input: {
      transactionId: string;
      data: UpdateTransactionDto;
    }
  ): Promise<TransactionDto> => {
    const { transactionId, data } = input;

    if (!transactionId)
      throw new DomainValidationError("Transaction ID is required");

    const validatedTransaction = updateTransactionSchema.parse(data);
    return transactionRepository.updateOne(
      userId,
      transactionId,
      validatedTransaction
    );
  };

  return withAuth(useCase);
};
