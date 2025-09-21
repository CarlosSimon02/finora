import { IncomeDto, IncomeDtoWithTotalEarned } from "@/core/schemas";
import { IncomeModel } from "@/data/models";
import { Timestamp } from "firebase-admin/firestore";

export const mapIncomeModelToDto = (model: IncomeModel): IncomeDto => ({
  id: model.id,
  name: model.name,
  colorTag: model.colorTag,
  createdAt: (model.createdAt as Timestamp).toDate(),
  updatedAt: (model.updatedAt as Timestamp).toDate(),
});

export const mapIncomeModelToDtoWithTotalEarned = (
  model: IncomeModel
): IncomeDtoWithTotalEarned => ({
  ...mapIncomeModelToDto(model),
  totalEarned: model.totalEarned,
});
