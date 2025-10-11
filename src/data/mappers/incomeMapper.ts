import { IncomeDto, IncomeWithTotalEarnedDto } from "@/core/schemas";
import { IncomeModel } from "@/data/models";

export const mapIncomeModelToDto = (model: IncomeModel): IncomeDto => ({
  id: model.id,
  name: model.name,
  colorTag: model.colorTag,
  createdAt: model.createdAt.toDate(),
  updatedAt: model.updatedAt.toDate(),
});

export const mapIncomeModelToDtoWithTotalEarned = (
  model: IncomeModel
): IncomeWithTotalEarnedDto => ({
  ...mapIncomeModelToDto(model),
  totalEarned: model.totalEarned,
});
