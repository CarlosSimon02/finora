import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { withAuth } from "@/core/useCases/utils";
import { TransactionId } from "@/core/valueObjects/transaction";
import { DomainValidationError } from "@/utils";

export const deleteTransaction = (
  transactionRepository: ITransactionRepository
) => {
  const useCase = async (
    userId: string,
    input: {
      transactionId: string;
    }
  ): Promise<void> => {
    const { transactionId } = input;

    // Validate transaction ID using domain value object
    const transactionIdOrError = TransactionId.create(transactionId);
    if (transactionIdOrError.isFailure) {
      throw new DomainValidationError(transactionIdOrError.error);
    }

    await transactionRepository.deleteOne(userId, transactionId);
  };

  return withAuth(useCase);
};
