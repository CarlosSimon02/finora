import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { TransactionDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getTransaction = (
  transactionRepository: ITransactionRepository
) => {
  const useCase = async (
    userId: string,
    input: {
      transactionId: string;
    }
  ): Promise<TransactionDto | null> => {
    const { transactionId } = input;

    if (!transactionId)
      throw new DomainValidationError("Transaction ID is required");

    return transactionRepository.getOneById(userId, transactionId);
  };

  return withAuth(useCase);
};
