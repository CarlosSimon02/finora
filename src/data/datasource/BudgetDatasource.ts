import { PaginationParams } from "@/core/schemas/paginationSchema";
import { userSubcollection } from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import {
  BudgetModel,
  BudgetModelPaginationResponse,
  budgetModelSchema,
  CreateBudgetModel,
  createBudgetModelSchema,
  UpdateBudgetModel,
  updateBudgetModelSchema,
} from "@/data/models";
import { validateOrThrow } from "@/data/utils/validation";
import { hasKeys } from "@/utils";
import { AggregateField } from "firebase-admin/firestore";

export class BudgetDatasource {
  getBudgetCollection(userId: string) {
    return userSubcollection(userId, "budgets");
  }

  async getById(userId: string, id: string): Promise<BudgetModel | null> {
    const budgetCollection = this.getBudgetCollection(userId);
    const budgetDoc = await budgetCollection.doc(id).get();
    if (!budgetDoc.exists) {
      return null;
    }

    const budget = budgetDoc.data();
    const validatedBudget = validateOrThrow(
      budgetModelSchema,
      budget,
      "BudgetDatasource:read"
    );

    return validatedBudget;
  }

  async createOne(userId: string, data: CreateBudgetModel) {
    const budgetCollection = this.getBudgetCollection(userId);
    const validatedData = validateOrThrow(
      createBudgetModelSchema,
      data,
      "BudgetDatasource:create"
    );
    const budgetDoc = budgetCollection.doc(validatedData.id);
    await budgetDoc.set(validatedData);
  }

  async getByName(userId: string, name: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    const budgetDoc = await budgetCollection.where("name", "==", name).get();
    if (budgetDoc.empty) {
      return null;
    }
    const budget = budgetDoc.docs[0].data();
    const validatedBudget = validateOrThrow(
      budgetModelSchema,
      budget,
      "BudgetDatasource:read"
    );
    return validatedBudget;
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<BudgetModelPaginationResponse> {
    const budgetCollection = this.getBudgetCollection(userId);
    const baseQuery = buildQueryFromParams(budgetCollection, params, {
      searchField: "name",
    });
    const response = await paginateByCursor({
      baseQuery,
      perPage: params.pagination.perPage,
      page: params.pagination.page,
      dataSchema: budgetModelSchema,
    });
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdateBudgetModel) {
    const budgetCollection = this.getBudgetCollection(userId);
    const validatedData = validateOrThrow(
      updateBudgetModelSchema,
      data,
      "BudgetDatasource:update"
    );
    if (hasKeys(validatedData)) {
      await budgetCollection.doc(id).update(validatedData);
    }
  }

  async deleteOne(userId: string, id: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    await budgetCollection.doc(id).delete();
  }

  async setTotalSpending(
    userId: string,
    budgetId: string,
    totalSpending: number
  ) {
    const budgetCollection = this.getBudgetCollection(userId);
    await budgetCollection.doc(budgetId).update({
      totalSpending,
    });
  }

  async getTotalMaxSpending(userId: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    const maxSpendingAggregation = budgetCollection.aggregate({
      totalMaxSpending: AggregateField.sum("maximumSpending"),
    });
    const aggregationResult = await maxSpendingAggregation.get();
    return aggregationResult.data().totalMaxSpending ?? 0;
  }

  async getCount(userId: string) {
    const budgetCollection = this.getBudgetCollection(userId);
    const countAggregation = budgetCollection.count();
    const aggregationResult = await countAggregation.get();
    return aggregationResult.data().count ?? 0;
  }
}
