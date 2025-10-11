import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  CreateTransactionDto,
  TransactionDto,
  createTransactionSchema,
} from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";

export const createTransaction = (
  transactionRepository: ITransactionRepository
) => {
  const useCase = async (
    userId: string,
    input: {
      data: CreateTransactionDto;
    }
  ): Promise<TransactionDto> => {
    const { data } = input;

    const validatedTransaction = createTransactionSchema.parse(data);
    return transactionRepository.createOne(userId, validatedTransaction);
  };

  return withAuth(useCase);
};
