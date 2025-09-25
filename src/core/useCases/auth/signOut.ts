import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";

export const signOut = (authRepository: IAuthClientRepository) => async () => {
  return authRepository.signOut();
};
