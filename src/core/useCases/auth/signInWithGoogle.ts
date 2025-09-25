import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";

export const signInWithGoogle =
  (authRepository: IAuthClientRepository) => async () => {
    return authRepository.signInWithGoogle();
  };
