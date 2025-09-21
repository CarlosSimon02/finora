import { PaginationParams } from "@/core/schemas/paginationSchema";
import { userSubcollection } from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import { validateOrThrow } from "@/data/utils/validation";
import hasKeys from "@/utils/hasKeys";
import { FieldValue } from "firebase-admin/firestore";
import {
  CreatePotModel,
  createPotModelSchema,
  PotModel,
  PotModelPaginationResponse,
  potModelSchema,
  UpdatePotModel,
  updatePotModelSchema,
} from "../models/potModel";

export class PotDatasource {
  getPotCollection(userId: string) {
    return userSubcollection(userId, "pots");
  }

  async getById(userId: string, id: string): Promise<PotModel | null> {
    const potCollection = this.getPotCollection(userId);
    const potDoc = await potCollection.doc(id).get();
    if (!potDoc.exists) {
      return null;
    }

    const pot = potDoc.data();
    const validatedPot = validateOrThrow(
      potModelSchema,
      pot,
      "PotDatasource:read"
    );

    return validatedPot as PotModel;
  }

  async createOne(userId: string, data: CreatePotModel) {
    const potCollection = this.getPotCollection(userId);
    const validatedData = validateOrThrow(
      createPotModelSchema,
      data,
      "PotDatasource:create"
    );
    const potDoc = potCollection.doc(validatedData.id);
    await potDoc.set(validatedData);
  }

  async getByName(userId: string, name: string) {
    const potCollection = this.getPotCollection(userId);
    const potDoc = await potCollection.where("name", "==", name).get();
    if (potDoc.empty) {
      return null;
    }
    const pot = potDoc.docs[0].data();
    const validatedPot = validateOrThrow(
      potModelSchema,
      pot,
      "PotDatasource:read"
    );
    return validatedPot as PotModel;
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PotModelPaginationResponse> {
    const potCollection = this.getPotCollection(userId);
    const baseQuery = buildQueryFromParams(potCollection, params, {
      searchField: "name",
    });
    const response = await paginateByCursor({
      baseQuery,
      perPage: params.pagination.perPage,
      page: params.pagination.page,
      dataSchema: potModelSchema,
    });
    return response;
  }

  async updateOne(userId: string, id: string, data: UpdatePotModel) {
    const potCollection = this.getPotCollection(userId);
    const validatedData = validateOrThrow(
      updatePotModelSchema,
      data,
      "PotDatasource:update"
    );
    if (hasKeys(validatedData)) {
      await potCollection.doc(id).update(validatedData);
    }
  }

  async deleteOne(userId: string, id: string) {
    const potCollection = this.getPotCollection(userId);
    await potCollection.doc(id).delete();
  }

  async addToTotalSaved(userId: string, potId: string, amount: number) {
    const potCollection = this.getPotCollection(userId);
    await potCollection.doc(potId).update({
      totalSaved: FieldValue.increment(amount),
    });
  }

  async subtractFromTotalSaved(userId: string, potId: string, amount: number) {
    const potCollection = this.getPotCollection(userId);
    await potCollection.doc(potId).update({
      totalSaved: FieldValue.increment(-amount),
    });
  }
}
