import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";

export const verifyEmail =
  (authRepository: IAuthClientRepository) => async (oobCode: string) => {
    return authRepository.applyEmailVerification(oobCode);
  };
