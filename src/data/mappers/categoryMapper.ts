import { CategoryDto } from "@/core/schemas";
import { CategoryModel } from "@/data/models";

export const mapCategoryModelToDto = (model: CategoryModel): CategoryDto => ({
  id: model.id,
  name: model.name,
  colorTag: model.colorTag,
  createdAt: model.createdAt.toDate(),
  updatedAt: model.updatedAt.toDate(),
});
