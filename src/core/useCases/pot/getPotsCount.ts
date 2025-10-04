import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { AuthError } from "@/utils";

export const getPotsCount =
  (potRepository: IPotRepository) =>
  async (userId: string): Promise<number> => {
    if (!userId) throw new AuthError();
    return potRepository.getCount(userId);
  };
