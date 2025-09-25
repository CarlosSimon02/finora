import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";

export const sendEmailVerification =
  (authRepository: IAuthClientRepository) => async () => {
    return authRepository.sendEmailVerification();
  };
