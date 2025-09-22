import { PaginationParams } from "@/core/schemas/paginationSchema";
import {
  recurringBillPaymentsSubcollection,
  userSubcollection,
} from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import {
  CreateRecurringBillModel,
  createRecurringBillModelSchema,
  CreateRecurringBillPaymentModel,
  createRecurringBillPaymentModelSchema,
  RecurringBillModel,
  RecurringBillModelPaginationResponse,
  recurringBillModelSchema,
  RecurringBillPaymentModel,
  recurringBillPaymentModelSchema,
  UpdateRecurringBillModel,
  updateRecurringBillModelSchema,
} from "@/data/models";
import { validateOrThrow } from "@/data/utils/validation";
import { DatasourceError, hasKeys } from "@/utils";

export class RecurringBillDatasource {
  getBillsCollection(userId: string) {
    return userSubcollection(userId, "recurringBills");
  }

  getPaymentsCollection(userId: string, billId: string) {
    return recurringBillPaymentsSubcollection(userId, billId);
  }

  async getById(
    userId: string,
    id: string
  ): Promise<RecurringBillModel | null> {
    try {
      const collection = this.getBillsCollection(userId);
      const doc = await collection.doc(id).get();
      if (!doc.exists) return null;
      const data = doc.data();
      const validated = validateOrThrow(
        recurringBillModelSchema,
        data,
        "RecurringBillDatasource:read"
      );
      return validated;
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`getById failed: ${e.message}`);
      throw e;
    }
  }

  async getByName(
    userId: string,
    name: string
  ): Promise<RecurringBillModel | null> {
    try {
      const collection = this.getBillsCollection(userId);
      const snapshot = await collection.where("name", "==", name).get();
      if (snapshot.empty) return null;
      const data = snapshot.docs[0].data();
      const validated = validateOrThrow(
        recurringBillModelSchema,
        data,
        "RecurringBillDatasource:read"
      );
      return validated;
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`getByName failed: ${e.message}`);
      throw e;
    }
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<RecurringBillModelPaginationResponse> {
    try {
      const collection = this.getBillsCollection(userId);
      const baseQuery = buildQueryFromParams(collection, params, {
        searchField: "name",
      });
      const response = await paginateByCursor({
        baseQuery,
        perPage: params.pagination.perPage,
        page: params.pagination.page,
        dataSchema: recurringBillModelSchema,
      });
      return response;
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`getPaginated failed: ${e.message}`);
      throw e;
    }
  }

  async createOne(userId: string, data: CreateRecurringBillModel) {
    try {
      const collection = this.getBillsCollection(userId);
      const validated = validateOrThrow(
        createRecurringBillModelSchema,
        data,
        "RecurringBillDatasource:create"
      );
      const doc = collection.doc(validated.id);
      await doc.set(validated);
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`createOne failed: ${e.message}`);
      throw e;
    }
  }

  async updateOne(userId: string, id: string, data: UpdateRecurringBillModel) {
    try {
      const collection = this.getBillsCollection(userId);
      const validated = validateOrThrow(
        updateRecurringBillModelSchema,
        data,
        "RecurringBillDatasource:update"
      );
      if (hasKeys(validated)) {
        await collection.doc(id).update(validated);
      }
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`updateOne failed: ${e.message}`);
      throw e;
    }
  }

  async deleteOne(userId: string, id: string) {
    try {
      const collection = this.getBillsCollection(userId);
      await collection.doc(id).delete();
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`deleteOne failed: ${e.message}`);
      throw e;
    }
  }

  async createPayment(
    userId: string,
    billId: string,
    data: CreateRecurringBillPaymentModel
  ): Promise<void> {
    try {
      const collection = this.getPaymentsCollection(userId, billId);
      const validated = validateOrThrow(
        createRecurringBillPaymentModelSchema,
        data,
        "RecurringBillDatasource:createPayment"
      );
      const doc = collection.doc(validated.id);
      await doc.set(validated);
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`createPayment failed: ${e.message}`);
      throw e;
    }
  }

  async getPaymentsInRange(
    userId: string,
    billId: string,
    start?: FirebaseFirestore.Timestamp,
    end?: FirebaseFirestore.Timestamp
  ): Promise<RecurringBillPaymentModel[]> {
    try {
      let query = this.getPaymentsCollection(userId, billId).orderBy(
        "occurrenceDate",
        "asc"
      );
      if (start) query = query.where("occurrenceDate", ">=", start);
      if (end) query = query.where("occurrenceDate", "<=", end);
      const snap = await query.get();
      return snap.docs.map((d) =>
        validateOrThrow(
          recurringBillPaymentModelSchema,
          d.data(),
          "RecurringBillDatasource:readPayment"
        )
      );
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`getPaymentsInRange failed: ${e.message}`);
      throw e;
    }
  }

  async getAll(userId: string): Promise<RecurringBillModel[]> {
    try {
      const snap = await this.getBillsCollection(userId).get();
      return snap.docs.map((d) =>
        validateOrThrow(
          recurringBillModelSchema,
          d.data(),
          "RecurringBillDatasource:readAll"
        )
      );
    } catch (e) {
      if (e instanceof Error)
        throw new DatasourceError(`getAll failed: ${e.message}`);
      throw e;
    }
  }
}
