import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { IUserRepository } from "@/core/interfaces/IUserRepository";
import { CreateUserDto, createUserSchema } from "@/core/schemas/userSchema";

export const onboardUser =
  (userRepository: IUserRepository, authRepository: IAuthAdminRepository) =>
  async (user: CreateUserDto) => {
    const existingUser = await userRepository.getOneById(user.id);
    if (!!existingUser) return existingUser;

    const validatedUser = createUserSchema.parse(user);

    const createdUser = await userRepository.createOne(validatedUser);
    await authRepository.updateUserDisplayName(
      user.id,
      validatedUser.displayName ?? ""
    );

    return createdUser;
  };
