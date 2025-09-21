import { CreateUserDto, UpdateUserDto, UserDto } from "@/core/schemas";

export interface IUserRepository {
  createOne(user: CreateUserDto): Promise<UserDto>;
  getOneById(uid: string): Promise<UserDto | null>;
  updateOne(uid: string, updates: UpdateUserDto): Promise<UserDto>;
  deleteOne(uid: string): Promise<void>;
}
