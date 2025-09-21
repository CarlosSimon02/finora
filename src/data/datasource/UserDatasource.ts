import { userCollection } from "@/data/firestore/collections";
import { validateOrThrow } from "@/data/utils/validation";
import hasKeys from "@/utils/hasKeys";
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
  }

  async createOne(user: CreateUserModel) {
    const userCollection = this.getUserCollection();
    const validatedUser = validateOrThrow(
      createUserModelSchema,
      user,
      "UserDatasource:create"
    );

    const userDoc = userCollection.doc(validatedUser.id);
    await userDoc.set(validatedUser);
  }

  async updateOne(id: string, data: UpdateUserModel) {
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
  }

  async deleteOne(id: string) {
    const userCollection = this.getUserCollection();
    const userDoc = userCollection.doc(id);
    await userDoc.delete();
  }
}
