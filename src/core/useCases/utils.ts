import { AuthError } from "@/utils";

export const withAuth = <T = void, U = unknown>(
  useCase: (userId: string, input: T) => Promise<U>
) => {
  return async (userId?: string, input?: T): Promise<U> => {
    if (!userId) {
      throw new AuthError();
    }

    const safeInput = (input ?? ({} as T)) as T;
    return useCase(userId, safeInput);
  };
};
