import {
  CreateIncomeDto,
  IncomeDto,
  IncomesSummaryDto,
  PaginatedIncomesResponseDto,
  PaginatedIncomesWithTransactionsResponseDto,
  PaginationParams,
  UpdateIncomeDto,
} from "@/core/schemas";

export interface IIncomeRepository {
  createOne(userId: string, input: CreateIncomeDto): Promise<IncomeDto>;
  getOneById(userId: string, incomeId: string): Promise<IncomeDto | null>;
  getOneByName(userId: string, name: string): Promise<IncomeDto | null>;
  getOneByColor(userId: string, colorTag: string): Promise<IncomeDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponseDto>;
  getUsedColors(userId: string): Promise<string[]>;
  getCount(userId: string): Promise<number>;
  updateOne(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto>;
  deleteOne(userId: string, incomeId: string): Promise<void>;
  getPaginatedWithTransactions(
    userId: string,
    params: PaginationParams,
    maxTransactionsToShow?: number
  ): Promise<PaginatedIncomesWithTransactionsResponseDto>;
  getSummary(
    userId: string,
    maxIncomesToShow?: number
  ): Promise<IncomesSummaryDto>;
}
