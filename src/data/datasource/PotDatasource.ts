import { PaginationParams } from "@/core/schemas";
import { userSubcollection } from "@/data/firestore/collections";
import { paginateByCursor } from "@/data/firestore/paginate";
import { buildQueryFromParams } from "@/data/firestore/query";
import { validateOrThrow } from "@/data/utils/validation";
import { DatasourceError, hasKeys } from "@/utils";
import { AggregateField, FieldValue } from "firebase-admin/firestore";
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
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getById failed: ${e.message}`);
      }
      throw e;
    }
  }

  async createOne(userId: string, data: CreatePotModel) {
    try {
      const potCollection = this.getPotCollection(userId);
      const validatedData = validateOrThrow(
        createPotModelSchema,
        data,
        "PotDatasource:create"
      );
      const potDoc = potCollection.doc(validatedData.id);
      await potDoc.set(validatedData);
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`createOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getByName(userId: string, name: string) {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getByName failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getByColor(userId: string, colorTag: string) {
    try {
      const potCollection = this.getPotCollection(userId);
      const snapshot = await potCollection
        .where("colorTag", "==", colorTag)
        .get();
      if (snapshot.empty) return null;
      const pot = snapshot.docs[0].data();
      const validatedPot = validateOrThrow(
        potModelSchema,
        pot,
        "PotDatasource:read"
      );
      return validatedPot as PotModel;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getByColor failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getDistinctColors(userId: string): Promise<string[]> {
    try {
      const potCollection = this.getPotCollection(userId);
      const snapshot = await potCollection.select("colorTag").get();
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
  ): Promise<PotModelPaginationResponse> {
    try {
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
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getPaginated failed: ${e.message}`);
      }
      throw e;
    }
  }

  async updateOne(userId: string, id: string, data: UpdatePotModel) {
    try {
      const potCollection = this.getPotCollection(userId);
      const validatedData = validateOrThrow(
        updatePotModelSchema,
        data,
        "PotDatasource:update"
      );
      if (hasKeys(validatedData)) {
        await potCollection.doc(id).update(validatedData);
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
      const potCollection = this.getPotCollection(userId);
      await potCollection.doc(id).delete();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`deleteOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async addToTotalSaved(userId: string, potId: string, amount: number) {
    try {
      const potCollection = this.getPotCollection(userId);
      await potCollection.doc(potId).update({
        totalSaved: FieldValue.increment(amount),
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`addToTotalSaved failed: ${e.message}`);
      }
      throw e;
    }
  }

  async subtractFromTotalSaved(userId: string, potId: string, amount: number) {
    try {
      const potCollection = this.getPotCollection(userId);
      await potCollection.doc(potId).update({
        totalSaved: FieldValue.increment(-amount),
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(
          `subtractFromTotalSaved failed: ${e.message}`
        );
      }
      throw e;
    }
  }

  async getCount(userId: string) {
    try {
      const potCollection = this.getPotCollection(userId);
      const countAggregation = potCollection.count();
      const aggregationResult = await countAggregation.get();
      return aggregationResult.data().count ?? 0;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getCount failed: ${e.message}`);
      }
      throw e;
    }
  }

  async getTotalSaved(userId: string) {
    try {
      const potCollection = this.getPotCollection(userId);
      const totalSavedAggregation = potCollection.aggregate({
        totalSaved: AggregateField.sum("totalSaved"),
      });
      const aggregationResult = await totalSavedAggregation.get();
      return aggregationResult.data().totalSaved ?? 0;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getTotalSaved failed: ${e.message}`);
      }
      throw e;
    }
  }
}
