import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";

export const verifyIdToken =
  (authAdminRepository: IAuthAdminRepository) => async (idToken: string) => {
    return authAdminRepository.verifyIdToken(idToken);
  };
