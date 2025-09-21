import { PotDto } from "@/core/schemas";
import { PotModel } from "@/data/models";
import { Timestamp } from "firebase-admin/firestore";

export const mapPotModelToDto = (model: PotModel): PotDto => ({
  id: model.id,
  name: model.name,
  colorTag: model.colorTag,
  target: model.target,
  totalSaved: model.totalSaved,
  createdAt: (model.createdAt as Timestamp).toDate(),
  updatedAt: (model.updatedAt as Timestamp).toDate(),
});
