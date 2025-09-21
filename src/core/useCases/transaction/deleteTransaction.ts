import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { AuthError, DomainValidationError } from "@/utils";

export const deleteTransaction =
  (transactionRepository: ITransactionRepository) =>
  async (userId: string, transactionId: string): Promise<void> => {
    if (!userId) throw new AuthError();
    if (!transactionId)
      throw new DomainValidationError("Transaction ID is required");

    await transactionRepository.deleteOne(userId, transactionId);
  };
