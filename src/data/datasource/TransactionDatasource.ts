import { PaginationParams } from "@/core/schemas/paginationSchema";
import { TransactionTypeDto } from "@/core/schemas/transactionSchema";
import { userSubcollection } from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import { validateOrThrow } from "@/data/utils/validation";
import { adminFirestore } from "@/services/firebase/firebaseAdmin";
import hasKeys from "@/utils/hasKeys";
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
  }

  async createOne(userId: string, transaction: CreateTransactionModel) {
    const transactionCollection = this.getTransactionCollection(userId);
    const validatedTransaction = validateOrThrow(
      createTransactionModelSchema,
      transaction,
      "TransactionDatasource:create"
    );

    const transactionDoc = transactionCollection.doc(validatedTransaction.id);
    await transactionDoc.set(validatedTransaction);
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<TransactionModelPaginationResponse> {
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
  }

  async updateOne(userId: string, id: string, data: UpdateTransactionModel) {
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
  }

  async hasTransactions(userId: string, categoryId: string) {
    const transactionCollection = this.getTransactionCollection(userId);
    const transactions = await transactionCollection
      .where("category.id", "==", categoryId)
      .count()
      .get();
    return transactions.data().count > 0;
  }

  async deleteOne(userId: string, id: string) {
    const transactionCollection = this.getTransactionCollection(userId);
    const transactionDoc = transactionCollection.doc(id);
    await transactionDoc.delete();
  }

  async calculateTotalByCategory(
    userId: string,
    categoryId: string
  ): Promise<number> {
    const userTransactions = this.getTransactionCollection(userId);

    const spendingAggregation = userTransactions
      .where("category.id", "==", categoryId)
      .aggregate({
        totalSpending: AggregateField.sum("signedAmount"),
      });

    const aggregationResult = await spendingAggregation.get();
    return aggregationResult.data().totalSpending ?? 0;
  }

  async calculateTotalByType(
    userId: string,
    type: TransactionTypeDto
  ): Promise<number> {
    const userTransactions = this.getTransactionCollection(userId);
    const spendingAggregation = userTransactions
      .where("type", "==", type)
      .aggregate({
        totalSpending: AggregateField.sum("signedAmount"),
      });
    const aggregationResult = await spendingAggregation.get();
    return aggregationResult.data().totalSpending ?? 0;
  }

  async updateMultipleByCategory(
    userId: string,
    categoryId: string,
    data: UpdateTransactionCategoryModel
  ) {
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
  }

  async deleteMultipleByCategory(userId: string, categoryId: string) {
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
  }
}
