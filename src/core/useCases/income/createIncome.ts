import { COLOR_OPTIONS } from "@/constants/colors";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { CreateIncomeDto, IncomeDto, createIncomeSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { ConflictError, DomainValidationError } from "@/utils";

export const createIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreateIncomeDto }
  ): Promise<IncomeDto> => {
    const { data } = input;

    const validatedData = createIncomeSchema.parse(data);

    const currentCount = await incomeRepository.getCount(userId);
    const maxItems = COLOR_OPTIONS.length;
    if (currentCount >= maxItems) {
      throw new DomainValidationError("Maximum number of incomes reached");
    }
    const incomeExists = await incomeRepository.getOneByName(
      userId,
      validatedData.name
    );

    if (incomeExists) throw new ConflictError("Income name already exists");

    const existingColor = await incomeRepository.getOneByColor(
      userId,
      validatedData.colorTag
    );
    if (existingColor) {
      throw new DomainValidationError("Income color already in use");
    }

    return incomeRepository.createOne(userId, validatedData);
  };

  return withAuth(useCase);
};
