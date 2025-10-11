import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import { SignUpCredentialsDto } from "@/core/schemas";

export const signUpWithEmail =
  (authRepository: IAuthClientRepository) =>
  async (credentials: SignUpCredentialsDto) => {
    return authRepository.signUpWithEmail(credentials);
  };
