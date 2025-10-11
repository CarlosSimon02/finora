import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { withAuth } from "@/core/useCases/utils";
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

    if (!transactionId)
      throw new DomainValidationError("Transaction ID is required");

    await transactionRepository.deleteOne(userId, transactionId);
  };

  return withAuth(useCase);
};
