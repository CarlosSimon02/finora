import { CategoryDto } from "@/core/schemas";
import { CategoryModel } from "@/data/models";
import { Timestamp } from "firebase-admin/firestore";

export const mapCategoryModelToDto = (model: CategoryModel): CategoryDto => ({
  id: model.id,
  name: model.name,
  colorTag: model.colorTag,
  createdAt: (model.createdAt as Timestamp).toDate(),
  updatedAt: (model.updatedAt as Timestamp).toDate(),
});
