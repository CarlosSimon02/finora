import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { AuthError } from "@/utils";

export const getUsedColors =
  (potRepository: IPotRepository) =>
  async (userId: string): Promise<string[]> => {
    if (!userId) throw new AuthError();
    const colors = await potRepository.getUsedColors(userId);
    return colors;
  };
