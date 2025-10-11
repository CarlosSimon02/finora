import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import { LoginWithEmailCredentialsDto } from "@/core/schemas";

export const logInWithEmail =
  (authRepository: IAuthClientRepository) =>
  async (credentials: LoginWithEmailCredentialsDto) => {
    return authRepository.logInWithEmail(credentials);
  };
