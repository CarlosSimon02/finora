import { PotDto } from "@/core/schemas";
import { PotModel } from "@/data/models";

export const mapPotModelToDto = (model: PotModel): PotDto => ({
  id: model.id,
  name: model.name,
  colorTag: model.colorTag,
  target: model.target,
  totalSaved: model.totalSaved,
  createdAt: model.createdAt.toDate(),
  updatedAt: model.updatedAt.toDate(),
});
