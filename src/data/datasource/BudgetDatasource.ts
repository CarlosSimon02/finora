import { PaginationParams } from "@/core/schemas";
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
import { DatasourceError, hasKeys } from "@/utils";
import { AggregateField } from "firebase-admin/firestore";

export class BudgetDatasource {
  getBudgetCollection(userId: string) {
    return userSubcollection(userId, "budgets");
  }

  async getById(userId: string, id: string): Promise<BudgetModel | null> {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getById failed: ${e.message}`);
      }
      throw e;
    }
  }

  async createOne(userId: string, data: CreateBudgetModel) {
    try {
      const budgetCollection = this.getBudgetCollection(userId);
      const validatedData = validateOrThrow(
        createBudgetModelSchema,
        data,
        "BudgetDatasource:create"
      );
      const budgetDoc = budgetCollection.doc(validatedData.id);
      await budgetDoc.set(validatedData);
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`createOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getByName(userId: string, name: string) {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getByName failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getByColor(userId: string, colorTag: string) {
    try {
      const budgetCollection = this.getBudgetCollection(userId);
      const snapshot = await budgetCollection
        .where("colorTag", "==", colorTag)
        .get();
      if (snapshot.empty) return null;
      const budget = snapshot.docs[0].data();
      const validatedBudget = validateOrThrow(
        budgetModelSchema,
        budget,
        "BudgetDatasource:read"
      );
      return validatedBudget;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getByColor failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getDistinctColors(userId: string): Promise<string[]> {
    try {
      const budgetCollection = this.getBudgetCollection(userId);
      const snapshot = await budgetCollection.select("colorTag").get();
      const colors = new Set<string>();
      snapshot.forEach((doc) => {
        const data = doc.data() as { colorTag?: string };
        if (typeof data?.colorTag === "string" && data.colorTag.trim()) {
          colors.add(data.colorTag);
        }
      });
      return Array.from(colors);
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getDistinctColors failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<BudgetModelPaginationResponse> {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getPaginated failed: ${e.message}`);
      }
      throw e;
    }
  }

  async updateOne(userId: string, id: string, data: UpdateBudgetModel) {
    try {
      const budgetCollection = this.getBudgetCollection(userId);
      const validatedData = validateOrThrow(
        updateBudgetModelSchema,
        data,
        "BudgetDatasource:update"
      );
      if (hasKeys(validatedData)) {
        await budgetCollection.doc(id).update(validatedData);
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
      const budgetCollection = this.getBudgetCollection(userId);
      await budgetCollection.doc(id).delete();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`deleteOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async setTotalSpending(
    userId: string,
    budgetId: string,
    totalSpending: number
  ) {
    try {
      const budgetCollection = this.getBudgetCollection(userId);
      await budgetCollection.doc(budgetId).update({
        totalSpending,
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`setTotalSpending failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getTotalMaxSpending(userId: string) {
    try {
      const budgetCollection = this.getBudgetCollection(userId);
      const maxSpendingAggregation = budgetCollection.aggregate({
        totalMaxSpending: AggregateField.sum("maximumSpending"),
      });
      const aggregationResult = await maxSpendingAggregation.get();
      return aggregationResult.data().totalMaxSpending ?? 0;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getTotalMaxSpending failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getCount(userId: string) {
    try {
      const budgetCollection = this.getBudgetCollection(userId);
      const countAggregation = budgetCollection.count();
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
