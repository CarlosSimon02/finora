import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { IUserRepository } from "@/core/interfaces/IUserRepository";

export const deleteUser =
  (
    authAdminRepository: IAuthAdminRepository,
    userRepository: IUserRepository
  ) =>
  async (uid: string) => {
    await authAdminRepository.deleteUser(uid);
    await userRepository.deleteOne(uid);
  };
