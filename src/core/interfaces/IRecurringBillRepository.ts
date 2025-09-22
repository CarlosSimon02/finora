import {
  CreateRecurringBillDto,
  CreateRecurringBillPaymentDto,
  DueSoonParamsDto,
  PaginatedRecurringBillsResponseDto,
  PaginationParams,
  RecurringBillDto,
  RecurringBillPaymentDto,
  RecurringBillsOffsetDto,
  RecurringBillsSummaryDto,
  RecurringBillsWithTotalsDto,
  UpdateRecurringBillDto,
} from "@/core/schemas";

export interface IRecurringBillRepository {
  createOne(
    userId: string,
    input: CreateRecurringBillDto
  ): Promise<RecurringBillDto>;
  getOneById(userId: string, billId: string): Promise<RecurringBillDto | null>;
  getOneByName(userId: string, name: string): Promise<RecurringBillDto | null>;
  getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedRecurringBillsResponseDto>;
  updateOne(
    userId: string,
    billId: string,
    input: UpdateRecurringBillDto
  ): Promise<RecurringBillDto>;
  deleteOne(userId: string, billId: string): Promise<void>;

  getTotalAmount(
    userId: string,
    offset?: RecurringBillsOffsetDto
  ): Promise<number>;

  getSummary(
    userId: string,
    offset?: RecurringBillsOffsetDto,
    dueSoonParams?: DueSoonParamsDto
  ): Promise<RecurringBillsSummaryDto>;

  getPaid(
    userId: string,
    params: PaginationParams,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto>;

  getUpcoming(
    userId: string,
    params: PaginationParams,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto>;

  getDueSoon(
    userId: string,
    params: PaginationParams,
    dueSoonParams: DueSoonParamsDto,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto>;

  recordPayment(
    userId: string,
    billId: string,
    payment: CreateRecurringBillPaymentDto
  ): Promise<RecurringBillPaymentDto>;

  createTransactionFromBill(
    userId: string,
    billId: string,
    payment: CreateRecurringBillPaymentDto
  ): Promise<{ transactionId: string; payment: RecurringBillPaymentDto }>;
}
