import { Transaction } from "@/core/entities/transaction";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { CreateTransactionDto, TransactionDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const createTransaction = (
  transactionRepository: ITransactionRepository
) => {
  const useCase = async (
    userId: string,
    input: {
      data: CreateTransactionDto;
    }
  ): Promise<TransactionDto> => {
    const { data } = input;

    // Note: We validate the input data, but let the repository handle
    // category lookup and full transaction creation since it needs to
    // fetch category details (name, colorTag) from the database
    // This is a pragmatic approach where the repository enriches the data

    // Validate basic transaction data using Transaction entity
    // This ensures the data format is correct before passing to repository
    const transactionOrError = Transaction.create({
      name: data.name,
      type: data.type,
      amount: data.amount,
      categoryId: data.categoryId,
      categoryName: "temp", // Repository will replace with actual
      categoryColorTag: "#277C78", // Repository will replace with actual
      emoji: data.emoji,
      transactionDate: data.transactionDate,
    });

    if (transactionOrError.isFailure) {
      throw new DomainValidationError(transactionOrError.error);
    }

    // Repository handles category lookup and creates the full transaction
    return transactionRepository.createOne(userId, data);
  };

  return withAuth(useCase);
};
