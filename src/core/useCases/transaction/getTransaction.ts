import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { TransactionDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { TransactionId } from "@/core/valueObjects/transaction";
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

    // Validate transaction ID using domain value object
    const transactionIdOrError = TransactionId.create(transactionId);
    if (transactionIdOrError.isFailure) {
      throw new DomainValidationError(transactionIdOrError.error);
    }

    return transactionRepository.getOneById(userId, transactionId);
  };

  return withAuth(useCase);
};
