import { AuthError } from "@/utils";

export const withAuth = <T = void, U = unknown>(
  useCase: (userId: string, input: T) => Promise<U>
) => {
  return (userId: string, input: T = {} as T): Promise<U> => {
    if (!userId) throw new AuthError();

    // If input is undefined, call without it
    if (input === undefined) {
      return useCase(userId, {} as T);
    }

    return useCase(userId, input);
  };
};
