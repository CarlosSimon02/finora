import { Result } from "@/core/entities/shared";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { TransactionDto, UpdateTransactionDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { Money } from "@/core/valueObjects/shared";
import {
  CategoryId,
  Emoji,
  TransactionId,
  TransactionName,
  TransactionType,
} from "@/core/valueObjects/transaction";
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

    // Validate transaction ID
    const transactionIdOrError = TransactionId.create(transactionId);
    if (transactionIdOrError.isFailure) {
      throw new DomainValidationError(transactionIdOrError.error);
    }

    // Validate each field if provided using domain value objects
    const validationResults: Result<any>[] = [];

    if (data.name !== undefined) {
      validationResults.push(TransactionName.create(data.name));
    }

    if (data.amount !== undefined) {
      validationResults.push(Money.create(data.amount));
    }

    if (data.emoji !== undefined) {
      validationResults.push(Emoji.create(data.emoji));
    }

    if (data.categoryId !== undefined) {
      validationResults.push(CategoryId.create(data.categoryId));
    }

    if (data.type !== undefined) {
      if (
        data.type !== TransactionType.INCOME &&
        data.type !== TransactionType.EXPENSE
      ) {
        throw new Error('Type must be either "income" or "expense"');
      }
    }

    if (data.transactionDate !== undefined) {
      if (
        !(data.transactionDate instanceof Date) ||
        isNaN(data.transactionDate.getTime())
      ) {
        throw new Error("Transaction date must be a valid date");
      }
    }

    // Check all validations
    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new Error(combinedResult.error);
    }

    // Business rule validation could go here
    // For example: Check if transaction is too old to modify certain fields

    // Validation passed - delegate to repository
    return transactionRepository.updateOne(userId, transactionId, data);
  };

  return withAuth(useCase);
};
