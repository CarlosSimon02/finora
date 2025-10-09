import { TransactionCategoryDto, TransactionDto } from "@/core/schemas";
import { TransactionModel } from "@/data/models";

export const mapTransactionModelToDto = (
  model: TransactionModel
): TransactionDto => {
  const category: TransactionCategoryDto = {
    id: model.category.id,
    name: model.category.name,
    colorTag: model.category.colorTag,
  };

  return {
    id: model.id,
    type: model.type,
    amount: model.amount,
    name: model.name,
    category,
    transactionDate: model.transactionDate.toDate(),
    emoji: model.emoji,
    createdAt: model.createdAt.toDate(),
    updatedAt: model.updatedAt.toDate(),
  };
};
