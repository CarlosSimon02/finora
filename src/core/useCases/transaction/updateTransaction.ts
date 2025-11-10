import { Transaction, TransactionCategory } from "@/core/entities/transaction";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { TransactionDto, UpdateTransactionDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { Money } from "@/core/valueObjects/shared";
import {
  Emoji,
  TransactionId,
  TransactionName,
  TransactionType,
} from "@/core/valueObjects/transaction";
import { DomainValidationError, NotFoundError } from "@/utils";

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

    // Get existing transaction
    const existingTransactionDto = await transactionRepository.getOneById(
      userId,
      transactionId
    );
    if (!existingTransactionDto) {
      throw new NotFoundError("Transaction not found");
    }

    // Reconstitute domain entity
    const categoryOrError = TransactionCategory.create(
      existingTransactionDto.category.id,
      existingTransactionDto.category.name,
      existingTransactionDto.category.colorTag
    );

    if (categoryOrError.isFailure) {
      throw new DomainValidationError(categoryOrError.error);
    }

    const transactionOrError = Transaction.reconstitute({
      id: transactionIdOrError.value,
      name: TransactionName.create(existingTransactionDto.name).value,
      type: existingTransactionDto.type as TransactionType,
      amount: Money.create(existingTransactionDto.amount).value,
      category: categoryOrError.value,
      emoji: Emoji.create(existingTransactionDto.emoji).value,
      transactionDate: existingTransactionDto.transactionDate,
      createdAt: existingTransactionDto.createdAt,
      updatedAt: existingTransactionDto.updatedAt,
    });

    if (transactionOrError.isFailure) {
      throw new DomainValidationError(transactionOrError.error);
    }

    const transaction = transactionOrError.value;

    // Prepare update data - if category is changing, fetch new category details
    let categoryName: string | undefined;
    let categoryColorTag: string | undefined;

    if (
      data.categoryId &&
      data.categoryId !== existingTransactionDto.category.id
    ) {
      // Repository will handle category lookup
      // For now, we just validate that the update data is valid
    }

    // Use entity's update method (validates internally)
    const updateResult = transaction.update({
      name: data.name,
      type: data.type,
      amount: data.amount,
      categoryId: data.categoryId,
      categoryName: categoryName,
      categoryColorTag: categoryColorTag,
      emoji: data.emoji,
      transactionDate: data.transactionDate,
    });

    if (updateResult.isFailure) {
      throw new DomainValidationError(updateResult.error);
    }

    // Repository handles category lookup if needed and updates the transaction
    return transactionRepository.updateOne(userId, transactionId, data);
  };

  return withAuth(useCase);
};
