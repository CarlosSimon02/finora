import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { CreateIncomeDto, IncomeDto, createIncomeSchema } from "@/core/schemas";
import { AuthError, ConflictError, DomainValidationError } from "@/utils";

export const createIncome =
  (incomeRepository: IIncomeRepository) =>
  async (userId: string, input: CreateIncomeDto): Promise<IncomeDto> => {
    if (!userId) throw new AuthError();

    const validatedData = createIncomeSchema.parse(input);
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
