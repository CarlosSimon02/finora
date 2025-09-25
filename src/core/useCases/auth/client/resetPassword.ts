import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";

export const resetPassword =
  (authRepository: IAuthClientRepository) => async (email: string) => {
    return authRepository.resetPassword(email);
  };
