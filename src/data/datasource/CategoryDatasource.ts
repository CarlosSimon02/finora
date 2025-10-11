import { PaginationParams } from "@/core/schemas";
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
import { DatasourceError, hasKeys } from "@/utils";

export class CategoryDatasource {
  getCategoryCollection(userId: string) {
    return userSubcollection(userId, "categories");
  }

  async getById(userId: string, id: string): Promise<CategoryModel | null> {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getById failed: ${e.message}`);
      }
      throw e;
    }
  }

  async createOne(userId: string, category: CreateCategoryModel) {
    try {
      const categoryCollection = this.getCategoryCollection(userId);
      const validatedCategory = validateOrThrow(
        createCategoryModelSchema,
        category,
        "CategoryDatasource:create"
      );
      const categoryDoc = categoryCollection.doc(validatedCategory.id);
      await categoryDoc.set(validatedCategory);
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`createOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async deleteOne(userId: string, id: string) {
    try {
      const categoryCollection = this.getCategoryCollection(userId);
      const categoryDoc = categoryCollection.doc(id);
      await categoryDoc.delete();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`deleteOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<CategoryModelPaginationResponse> {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getPaginated failed: ${e.message}`);
      }
      throw e;
    }
  }

  async updateOne(userId: string, id: string, data: UpdateCategoryModel) {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`updateOne failed: ${e.message}`);
      }
      throw e;
    }
  }
}
