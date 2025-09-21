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
import { hasKeys } from "@/utils";

export class IncomeDatasource {
  getIncomeCollection(userId: string) {
    return userSubcollection(userId, "incomes");
  }

  async getById(userId: string, id: string) {
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
  }

  async createOne(userId: string, data: CreateIncomeModel) {
    const incomeCollection = this.getIncomeCollection(userId);
    const validatedData = validateOrThrow(
      createIncomeModelSchema,
      data,
      "IncomeDatasource:create"
    );
    const incomeDoc = incomeCollection.doc(validatedData.id);
    await incomeDoc.set(validatedData);
  }

  async getByName(userId: string, name: string) {
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
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<IncomeModelPaginationResponse> {
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
  }

  async updateOne(userId: string, id: string, data: UpdateIncomeModel) {
    const incomeCollection = this.getIncomeCollection(userId);
    const validatedData = validateOrThrow(
      updateIncomeModelSchema,
      data,
      "IncomeDatasource:update"
    );
    if (hasKeys(validatedData)) {
      await incomeCollection.doc(id).update(validatedData);
    }
  }

  async deleteOne(userId: string, id: string) {
    const incomeCollection = this.getIncomeCollection(userId);
    await incomeCollection.doc(id).delete();
  }

  async setTotalEarned(userId: string, incomeId: string, totalEarned: number) {
    const incomeCollection = this.getIncomeCollection(userId);
    await incomeCollection.doc(incomeId).update({
      totalEarned,
    });
  }

  async getCount(userId: string) {
    const incomeCollection = this.getIncomeCollection(userId);
    const countAggregation = incomeCollection.count();
    const aggregationResult = await countAggregation.get();
    return aggregationResult.data().count ?? 0;
  }
}
