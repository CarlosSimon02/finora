import { BudgetDto, BudgetWithTotalSpendingDto } from "@/core/schemas";
import { BudgetModel } from "@/data/models";

export const mapBudgetModelToDto = (model: BudgetModel): BudgetDto => ({
  id: model.id,
  name: model.name,
  maximumSpending: model.maximumSpending,
  colorTag: model.colorTag,
  createdAt: model.createdAt.toDate(),
  updatedAt: model.updatedAt.toDate(),
});

export const mapBudgetModelToDtoWithTotalSpending = (
  model: BudgetModel
): BudgetWithTotalSpendingDto => ({
  ...mapBudgetModelToDto(model),
  totalSpending: model.totalSpending,
});
