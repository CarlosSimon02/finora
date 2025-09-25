import { userCollection } from "@/data/firestore/collections";
import { validateOrThrow } from "@/data/utils/validation";
import { DatasourceError, hasKeys } from "@/utils";
import {
  CreateUserModel,
  createUserModelSchema,
  UpdateUserModel,
  updateUserModelSchema,
  UserModel,
  userModelSchema,
} from "../models/userModel";

export class UserDatasource {
  getUserCollection() {
    return userCollection();
  }

  async getById(id: string): Promise<UserModel | null> {
    try {
      const userCollection = this.getUserCollection();
      const userDoc = await userCollection.doc(id).get();

      if (!userDoc.exists) {
        return null;
      }

      const user = userDoc.data();
      const validatedUser = validateOrThrow(
        userModelSchema,
        user,
        "UserDatasource:read"
      );

      return validatedUser;
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`getById failed: ${e.message}`);
      }
      throw e;
    }
  }

  async createOne(user: CreateUserModel) {
    try {
      const userCollection = this.getUserCollection();
      const validatedUser = validateOrThrow(
        createUserModelSchema,
        user,
        "UserDatasource:create"
      );

      const userDoc = userCollection.doc(validatedUser.id);
      await userDoc.set(validatedUser);
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`createOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async updateOne(id: string, data: UpdateUserModel) {
    try {
      const userCollection = this.getUserCollection();
      const validatedData = validateOrThrow(
        updateUserModelSchema,
        data,
        "UserDatasource:update"
      );
      if (hasKeys(validatedData)) {
        const userDoc = userCollection.doc(id);
        await userDoc.update(validatedData);
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`updateOne failed: ${e.message}`);
      }
      throw e;
    }
  }

  async deleteOne(id: string) {
    try {
      const userCollection = this.getUserCollection();
      const userDoc = userCollection.doc(id);
      await userDoc.delete();
    } catch (e) {
      if (e instanceof Error) {
        throw new DatasourceError(`deleteOne failed: ${e.message}`);
      }
      throw e;
    }
  }
}
