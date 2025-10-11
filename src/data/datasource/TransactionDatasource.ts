import { PaginationParams, TransactionType } from "@/core/schemas";
import { userSubcollection } from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import { validateOrThrow } from "@/data/utils/validation";
import { adminFirestore } from "@/infrastructure/firebase/firebaseAdmin";
import { DatasourceError, hasKeys } from "@/utils";
import { AggregateField } from "firebase-admin/firestore";
import {
  CreateTransactionModel,
  createTransactionModelSchema,
  TransactionModel,
  TransactionModelPaginationResponse,
  transactionModelSchema,
  UpdateTransactionCategoryModel,
  updateTransactionCategoryModelSchema,
  UpdateTransactionModel,
  updateTransactionModelSchema,
} from "../models/transactionModel";

export class TransactionDatasource {
  getTransactionCollection(userId: string) {
    return userSubcollection(userId, "transactions");
  }

  async getById(userId: string, id: string): Promise<TransactionModel | null> {
    try {
      const transactionCollection = this.getTransactionCollection(userId);
      const transactionDoc = await transactionCollection.doc(id).get();

      if (!transactionDoc.exists) {
        return null;
      }

      const transaction = transactionDoc.data();
      const validatedTransaction = validateOrThrow(
        transactionModelSchema,
        transaction,
        "TransactionDatasource:read"
      );

      return validatedTransaction;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getById failed: ${e.message}`);
      }
      throw e;
    }
  }

  async createOne(userId: string, transaction: CreateTransactionModel) {
    try {
      const transactionCollection = this.getTransactionCollection(userId);
      const validatedTransaction = validateOrThrow(
        createTransactionModelSchema,
        transaction,
        "TransactionDatasource:create"
      );

      const transactionDoc = transactionCollection.doc(validatedTransaction.id);
      await transactionDoc.set(validatedTransaction);
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`createOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<TransactionModelPaginationResponse> {
    try {
      const transactionCollection = this.getTransactionCollection(userId);
      const baseQuery = buildQueryFromParams(transactionCollection, params, {
        searchField: "name",
      });
      const response = await paginateByCursor({
        baseQuery,
        perPage: params.pagination.perPage,
        page: params.pagination.page,
        dataSchema: transactionModelSchema,
      });
      return response;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getPaginated failed: ${e.message}`);
      }
      throw e;
    }
  }

  async updateOne(userId: string, id: string, data: UpdateTransactionModel) {
    try {
      const transactionCollection = this.getTransactionCollection(userId);
      const validatedData = validateOrThrow(
        updateTransactionModelSchema,
        data,
        "TransactionDatasource:update"
      );
      if (hasKeys(validatedData)) {
        const transactionDoc = transactionCollection.doc(id);
        await transactionDoc.update(validatedData);
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`updateOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async hasTransactions(userId: string, categoryId: string) {
    try {
      const transactionCollection = this.getTransactionCollection(userId);
      const transactions = await transactionCollection
        .where("category.id", "==", categoryId)
        .count()
        .get();
      return transactions.data().count > 0;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`hasTransactions failed: ${e.message}`);
      }
      throw e;
    }
  }

  async deleteOne(userId: string, id: string) {
    try {
      const transactionCollection = this.getTransactionCollection(userId);
      const transactionDoc = transactionCollection.doc(id);
      await transactionDoc.delete();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`deleteOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async calculateTotalByCategory(
    userId: string,
    categoryId: string
  ): Promise<number> {
    try {
      const userTransactions = this.getTransactionCollection(userId);

      const spendingAggregation = userTransactions
        .where("category.id", "==", categoryId)
        .aggregate({
          totalSpending: AggregateField.sum("signedAmount"),
        });

      const aggregationResult = await spendingAggregation.get();
      return aggregationResult.data().totalSpending ?? 0;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(
          `calculateTotalByCategory failed: ${e.message}`
        );
      }
      throw e;
    }
  }

  async calculateTotalByType(
    userId: string,
    type: TransactionType
  ): Promise<number> {
    try {
      const userTransactions = this.getTransactionCollection(userId);
      const spendingAggregation = userTransactions
        .where("type", "==", type)
        .aggregate({
          totalSpending: AggregateField.sum("signedAmount"),
        });
      const aggregationResult = await spendingAggregation.get();
      return aggregationResult.data().totalSpending ?? 0;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`calculateTotalByType failed: ${e.message}`);
      }
      throw e;
    }
  }

  async updateMultipleByCategory(
    userId: string,
    categoryId: string,
    data: UpdateTransactionCategoryModel
  ) {
    try {
      const transactionCollection = this.getTransactionCollection(userId);

      // Validate the input data
      const validatedData = validateOrThrow(
        updateTransactionCategoryModelSchema,
        data,
        "TransactionDatasource:updateCategory"
      );

      // Return early if no valid data to update
      if (!validatedData || !hasKeys(validatedData)) {
        return;
      }

      // Create bulk writer instance
      const bulkWriter = adminFirestore.bulkWriter();

      // Get all transactions matching the category
      const transactions = await transactionCollection
        .where("category.id", "==", categoryId)
        .get();

      // Queue all updates
      transactions.docs.forEach((transaction) => {
        bulkWriter.update(transaction.ref, {
          "category.name": validatedData.name,
          "category.colorTag": validatedData.colorTag,
        });
      });

      // Execute all operations
      await bulkWriter.close();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(
          `updateMultipleByCategory failed: ${e.message}`
        );
      }
      throw e;
    }
  }

  async deleteMultipleByCategory(userId: string, categoryId: string) {
    try {
      const transactionCollection = this.getTransactionCollection(userId);

      // Create bulk writer instance
      const bulkWriter = adminFirestore.bulkWriter();

      // Get all transactions matching the category
      const transactions = await transactionCollection
        .where("category.id", "==", categoryId)
        .get();

      // Queue all deletes
      transactions.docs.forEach((transaction) => {
        bulkWriter.delete(transaction.ref);
      });

      // Execute all operations
      await bulkWriter.close();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(
          `deleteMultipleByCategory failed: ${e.message}`
        );
      }
      throw e;
    }
  }
}
