import { IUserRepository } from "@/core/interfaces/IUserRepository";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from "@/core/schemas/userSchema";
import { UserDatasource } from "@/data/datasource/UserDatasource";
import { mapUserModelToDto } from "@/data/mappers";
import { CreateUserModel, UpdateUserModel } from "@/data/models";
import { FieldValue } from "firebase-admin/firestore";

export class UserRepository implements IUserRepository {
  private readonly userDatasource: UserDatasource;

  constructor() {
    this.userDatasource = new UserDatasource();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapUser(userId: string): Promise<UserDto> {
    const user = await this.userDatasource.getById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    return mapUserModelToDto(user);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  async createOne(user: CreateUserDto): Promise<UserDto> {
    const userData: CreateUserModel = {
      id: user.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      email: user.email,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      phoneNumber: user.phoneNumber ?? null,
      customClaims: user.customClaims ?? null,
    };

    await this.userDatasource.createOne(userData);
    return this.getAndMapUser(user.id);
  }

  // #########################################################
  // # 📝 Read One
  // #########################################################

  async getOneById(id: string): Promise<UserDto | null> {
    const user = await this.userDatasource.getById(id);
    if (!user) return null;
    return this.getAndMapUser(id);
  }

  // #########################################################
  // # 🔄 Update One
  // #########################################################

  private async buildUpdateData(
    currentUser: UserDto,
    input: UpdateUserDto
  ): Promise<UpdateUserModel> {
    const updateData: UpdateUserModel = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (
      input.displayName !== undefined &&
      input.displayName !== currentUser.displayName
    ) {
      updateData.displayName = input.displayName;
    }

    if (
      input.photoURL !== undefined &&
      input.photoURL !== currentUser.photoURL
    ) {
      updateData.photoURL = input.photoURL;
    }

    if (
      input.phoneNumber !== undefined &&
      input.phoneNumber !== currentUser.phoneNumber
    ) {
      updateData.phoneNumber = input.phoneNumber;
    }

    if (
      input.customClaims !== undefined &&
      input.customClaims !== currentUser.customClaims
    ) {
      updateData.customClaims = input.customClaims;
    }

    return updateData;
  }

  async updateOne(id: string, input: UpdateUserDto): Promise<UserDto> {
    const currentUser = await this.getOneById(id);
    if (!currentUser) throw new Error("User not found");
    const updateData = await this.buildUpdateData(currentUser, input);
    await this.userDatasource.updateOne(id, updateData);
    return this.getAndMapUser(id);
  }

  // #########################################################
  // # 🗑️ Delete One
  // #########################################################

  async deleteOne(id: string): Promise<void> {
    await this.userDatasource.deleteOne(id);
  }
}
