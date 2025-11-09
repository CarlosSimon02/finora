import { Result } from "@/core/entities/shared";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { CreateTransactionDto, TransactionDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { Money } from "@/core/valueObjects/shared";
import {
  CategoryId,
  Emoji,
  TransactionName,
  TransactionType,
} from "@/core/valueObjects/transaction";

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

    // Validate using domain value objects
    const validationResults: Result<any>[] = [
      TransactionName.create(data.name),
      Money.create(data.amount),
      Emoji.create(data.emoji),
      CategoryId.create(data.categoryId),
    ];

    // Validate transaction type
    if (
      data.type !== TransactionType.INCOME &&
      data.type !== TransactionType.EXPENSE
    ) {
      throw new Error('Type must be either "income" or "expense"');
    }

    // Check all validations
    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new Error(combinedResult.error);
    }

    // Validate transaction date
    if (
      !(data.transactionDate instanceof Date) ||
      isNaN(data.transactionDate.getTime())
    ) {
      throw new Error("Transaction date must be a valid date");
    }

    // Validation passed - delegate to repository
    // Repository will handle category lookup and persistence
    return transactionRepository.createOne(userId, data);
  };

  return withAuth(useCase);
};
