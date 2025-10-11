import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { withAuth } from "@/core/useCases/utils";

export const getPotsCount = (potRepository: IPotRepository) => {
  const useCase = async (userId: string): Promise<number> => {
    return potRepository.getCount(userId);
  };

  return withAuth(useCase);
};
