import { BudgetDto, BudgetWithTotalSpendingDto } from "@/core/schemas";
import { BudgetModel } from "@/data/models";
import { Timestamp } from "firebase-admin/firestore";

export const mapBudgetModelToDto = (model: BudgetModel): BudgetDto => ({
  id: model.id,
  name: model.name,
  maximumSpending: model.maximumSpending,
  colorTag: model.colorTag,
  createdAt: (model.createdAt as Timestamp).toDate(),
  updatedAt: (model.updatedAt as Timestamp).toDate(),
});

export const mapBudgetModelToDtoWithTotalSpending = (
  model: BudgetModel
): BudgetWithTotalSpendingDto => ({
  ...mapBudgetModelToDto(model),
  totalSpending: model.totalSpending,
});
