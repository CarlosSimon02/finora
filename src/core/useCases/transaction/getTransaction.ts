import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { TransactionDto } from "@/core/schemas/transactionSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getTransaction =
  (transactionRepository: ITransactionRepository) =>
  async (
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null> => {
    if (!userId) throw new AuthError();
    if (!transactionId)
      throw new DomainValidationError("Transaction ID is required");

    return transactionRepository.getOneById(userId, transactionId);
  };
