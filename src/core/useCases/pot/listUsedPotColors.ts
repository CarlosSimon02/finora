import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { withAuth } from "@/core/useCases/utils";

export const listUsedPotColors = (potRepository: IPotRepository) => {
  const useCase = async (userId: string): Promise<string[]> => {
    const colors = await potRepository.getUsedColors(userId);
    return colors;
  };

  return withAuth(useCase);
};
