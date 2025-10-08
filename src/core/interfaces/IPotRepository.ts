import {
  CreatePotDto,
  PaginatedPotsResponseDto,
  PaginationParams,
  PotDto,
  PotsSummaryDto,
  UpdatePotDto,
} from "@/core/schemas";

export interface IPotRepository {
  createOne(userId: string, input: CreatePotDto): Promise<PotDto>;
  getOneById(userId: string, potId: string): Promise<PotDto | null>;
  getOneByName(userId: string, name: string): Promise<PotDto | null>;
  getOneByColor(userId: string, colorTag: string): Promise<PotDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedPotsResponseDto>;
  getUsedColors(userId: string): Promise<string[]>;
  getCount(userId: string): Promise<number>;
  getSummary(userId: string, maxPotsToShow?: number): Promise<PotsSummaryDto>;
  updateOne(
    userId: string,
    potId: string,
    input: UpdatePotDto
  ): Promise<PotDto>;
  deleteOne(userId: string, potId: string): Promise<void>;
  addToTotalSaved(
    userId: string,
    potId: string,
    amount: number
  ): Promise<PotDto>;
  withdrawMoney(userId: string, potId: string, amount: number): Promise<PotDto>;
}
