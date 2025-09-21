import {
  CreateTransactionDto,
  PaginatedCategoriesResponseDto,
  PaginatedTransactionsResponseDto,
  PaginationParams,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas";

export interface ITransactionRepository {
  createOne(
    userId: string,
    input: CreateTransactionDto
  ): Promise<TransactionDto>;
  getOneById(
    userId: string,
    transactionId: string
  ): Promise<TransactionDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponseDto>;
  updateOne(
    userId: string,
    transactionId: string,
    input: UpdateTransactionDto
  ): Promise<TransactionDto>;
  deleteOne(userId: string, transactionId: string): Promise<void>;
  getPaginatedCategories(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponseDto>;
}
