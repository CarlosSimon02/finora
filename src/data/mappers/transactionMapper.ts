import { TransactionCategoryDto, TransactionDto } from "@/core/schemas";
import { TransactionModel } from "@/data/models";
import { Timestamp } from "firebase-admin/firestore";

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
    recipientOrPayer: model.recipientOrPayer,
    category,
    transactionDate: (model.transactionDate as Timestamp).toDate(),
    description: model.description,
    emoji: model.emoji,
    createdAt: (model.createdAt as Timestamp).toDate(),
    updatedAt: (model.updatedAt as Timestamp).toDate(),
  };
};
