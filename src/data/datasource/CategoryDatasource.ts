import { PaginationParams } from "@/core/schemas/paginationSchema";
import { userSubcollection } from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import {
  CategoryModel,
  CategoryModelPaginationResponse,
  categoryModelSchema,
  CreateCategoryModel,
  createCategoryModelSchema,
  UpdateCategoryModel,
  updateCategoryModelSchema,
} from "@/data/models";
import { validateOrThrow } from "@/data/utils/validation";
import { hasKeys } from "@/utils";

export class CategoryDatasource {
  getCategoryCollection(userId: string) {
    return userSubcollection(userId, "categories");
  }

  async getById(userId: string, id: string): Promise<CategoryModel | null> {
    const categoryCollection = this.getCategoryCollection(userId);
    const categoryDoc = await categoryCollection.doc(id).get();

    if (!categoryDoc.exists) {
      return null;
    }

    const category = categoryDoc.data();
    const validatedCategory = validateOrThrow(
      categoryModelSchema,
      category,
      "CategoryDatasource:read"
    );

    return validatedCategory;
  }

  async createOne(userId: string, category: CreateCategoryModel) {
    const categoryCollection = this.getCategoryCollection(userId);
    const validatedCategory = validateOrThrow(
      createCategoryModelSchema,
      category,
      "CategoryDatasource:create"
    );
    const categoryDoc = categoryCollection.doc(validatedCategory.id);
    await categoryDoc.set(validatedCategory);
  }

  async deleteOne(userId: string, id: string) {
    const categoryCollection = this.getCategoryCollection(userId);
    const categoryDoc = categoryCollection.doc(id);
    await categoryDoc.delete();
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<CategoryModelPaginationResponse> {
    const categoryCollection = this.getCategoryCollection(userId);
    const baseQuery = buildQueryFromParams(categoryCollection, params, {
      searchField: "name",
    });
    const response = await paginateByCursor({
      baseQuery,
      perPage: params.pagination.perPage,
      page: params.pagination.page,
      dataSchema: categoryModelSchema,
    });
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdateCategoryModel) {
    const categoryCollection = this.getCategoryCollection(userId);
    const categoryDoc = categoryCollection.doc(id);
    const validatedData = validateOrThrow(
      updateCategoryModelSchema,
      data,
      "CategoryDatasource:update"
    );
    if (validatedData && hasKeys(validatedData)) {
      await categoryDoc.update(validatedData);
    }
  }
}
