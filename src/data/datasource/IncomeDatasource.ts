import { PaginationParams } from "@/core/schemas/paginationSchema";
import { userSubcollection } from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import {
  CreateIncomeModel,
  createIncomeModelSchema,
  IncomeModelPaginationResponse,
  incomeModelSchema,
  UpdateIncomeModel,
  updateIncomeModelSchema,
} from "@/data/models";
import { validateOrThrow } from "@/data/utils/validation";
import { DatasourceError, hasKeys } from "@/utils";

export class IncomeDatasource {
  getIncomeCollection(userId: string) {
    return userSubcollection(userId, "incomes");
  }

  async getById(userId: string, id: string) {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      const incomeDoc = await incomeCollection.doc(id).get();

      if (!incomeDoc.exists) {
        return null;
      }

      const income = incomeDoc.data();
      const validatedIncome = validateOrThrow(
        incomeModelSchema,
        income,
        "IncomeDatasource:read"
      );

      return validatedIncome;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getById failed: ${e.message}`);
      }
      throw e;
    }
  }

  async createOne(userId: string, data: CreateIncomeModel) {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      const validatedData = validateOrThrow(
        createIncomeModelSchema,
        data,
        "IncomeDatasource:create"
      );
      const incomeDoc = incomeCollection.doc(validatedData.id);
      await incomeDoc.set(validatedData);
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`createOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getByName(userId: string, name: string) {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      const incomeDoc = await incomeCollection.where("name", "==", name).get();
      if (incomeDoc.empty) {
        return null;
      }
      const income = incomeDoc.docs[0].data();
      const validatedIncome = validateOrThrow(
        incomeModelSchema,
        income,
        "IncomeDatasource:read"
      );
      return validatedIncome;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getByName failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<IncomeModelPaginationResponse> {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      const baseQuery = buildQueryFromParams(incomeCollection, params, {
        searchField: "name",
      });
      const response = await paginateByCursor({
        baseQuery,
        perPage: params.pagination.perPage,
        page: params.pagination.page,
        dataSchema: incomeModelSchema,
      });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getPaginated failed: ${e.message}`);
      }
      throw e;
    }
  }

  async updateOne(userId: string, id: string, data: UpdateIncomeModel) {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      const validatedData = validateOrThrow(
        updateIncomeModelSchema,
        data,
        "IncomeDatasource:update"
      );
      if (hasKeys(validatedData)) {
        await incomeCollection.doc(id).update(validatedData);
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`updateOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async deleteOne(userId: string, id: string) {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      await incomeCollection.doc(id).delete();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`deleteOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async setTotalEarned(userId: string, incomeId: string, totalEarned: number) {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      await incomeCollection.doc(incomeId).update({
        totalEarned,
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`setTotalEarned failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getCount(userId: string) {
    try {
      const incomeCollection = this.getIncomeCollection(userId);
      const countAggregation = incomeCollection.count();
      const aggregationResult = await countAggregation.get();
      return aggregationResult.data().count ?? 0;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getCount failed: ${e.message}`);
      }
      throw e;
    }
  }
}
