import { IUserRepository } from "@/core/interfaces/IUserRepository";
import { UpdateUserDto } from "@/core/schemas";

export const updateUserProfile =
  (userRepository: IUserRepository) =>
  async (id: string, updates: UpdateUserDto) => {
    return userRepository.updateOne(id, updates);
  };
