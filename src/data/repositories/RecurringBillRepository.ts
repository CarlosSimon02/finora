import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
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
import {
  BudgetDatasource,
  CategoryDatasource,
  TransactionDatasource,
} from "@/data/datasource";
import { RecurringBillDatasource } from "@/data/datasource/RecurringBillDatasource";
import {
  mapRecurringBillModelToDto,
  mapRecurringBillPaymentModelToDto,
} from "@/data/mappers";
import {
  CreateRecurringBillModel,
  CreateRecurringBillPaymentModel,
  RecurringBillModel,
  UpdateRecurringBillModel,
} from "@/data/models";
import { generateId } from "@/utils";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { RRule } from "rrule";

export class RecurringBillRepository implements IRecurringBillRepository {
  private readonly datasource: RecurringBillDatasource;
  private readonly transactionDatasource: TransactionDatasource;
  private readonly budgetDatasource: BudgetDatasource;
  private readonly categoryDatasource: CategoryDatasource;

  constructor() {
    this.datasource = new RecurringBillDatasource();
    this.transactionDatasource = new TransactionDatasource();
    this.budgetDatasource = new BudgetDatasource();
    this.categoryDatasource = new CategoryDatasource();
  }

  // #########################################################
  // # 🛠️ Helpers
  // #########################################################

  private toTimestamp(date: Date | undefined | null) {
    return date ? Timestamp.fromDate(date) : undefined;
  }

  private async getAndMapBill(
    userId: string,
    billId: string
  ): Promise<RecurringBillDto> {
    const bill = await this.datasource.getById(userId, billId);
    if (!bill)
      throw new Error(`Recurring bill ${billId} not found for user ${userId}`);
    return mapRecurringBillModelToDto(bill);
  }

  private buildCreateBill(
    input: CreateRecurringBillDto
  ): CreateRecurringBillModel {
    return {
      id: generateId(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      name: input.name,
      amount: input.amount,
      recipientOrPayer: input.recipientOrPayer,
      description: input.description,
      emoji: input.emoji,
      categoryId: input.categoryId,
      rrule: input.rrule,
      dtstart: Timestamp.fromDate(input.dtstart),
      until: this.toTimestamp(input.until)!,
      // category will be joined/mapped elsewhere if needed
    } as unknown as CreateRecurringBillModel;
  }

  private buildUpdateBill(
    current: RecurringBillDto,
    input: UpdateRecurringBillDto
  ): UpdateRecurringBillModel {
    const update: UpdateRecurringBillModel = {
      updatedAt: FieldValue.serverTimestamp(),
    } as UpdateRecurringBillModel;

    if (input.name !== undefined && input.name !== current.name)
      update.name = input.name;
    if (input.amount !== undefined && input.amount !== current.amount)
      update.amount = input.amount;
    if (
      input.recipientOrPayer !== undefined &&
      input.recipientOrPayer !== current.recipientOrPayer
    )
      update.recipientOrPayer = input.recipientOrPayer;
    if (
      input.description !== undefined &&
      input.description !== current.description
    )
      update.description = input.description;
    if (input.emoji !== undefined && input.emoji !== current.emoji)
      update.emoji = input.emoji;
    if (
      input.categoryId !== undefined &&
      input.categoryId !== current.categoryId
    )
      update.categoryId = input.categoryId;
    if (input.rrule !== undefined && input.rrule !== current.rrule)
      update.rrule = input.rrule;
    if (
      input.dtstart !== undefined &&
      input.dtstart.getTime() !== current.dtstart.getTime()
    )
      update.dtstart = Timestamp.fromDate(input.dtstart);
    if (input.until !== undefined)
      update.until = this.toTimestamp(input.until)!;

    return update;
  }

  private buildPayment(
    input: CreateRecurringBillPaymentDto
  ): CreateRecurringBillPaymentModel {
    return {
      id: generateId(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      billId: input.billId,
      occurrenceDate: Timestamp.fromDate(input.occurrenceDate),
      amountPaid: input.amountPaid,
      note: input.note ?? null,
      transactionId: null,
    };
  }

  // #########################################################
  // # CRUD
  // #########################################################

  async createOne(
    userId: string,
    input: CreateRecurringBillDto
  ): Promise<RecurringBillDto> {
    const model = this.buildCreateBill(input);
    await this.datasource.createOne(userId, model);
    return this.getAndMapBill(userId, model.id);
  }

  async getOneById(
    userId: string,
    billId: string
  ): Promise<RecurringBillDto | null> {
    const bill = await this.datasource.getById(userId, billId);
    return bill ? mapRecurringBillModelToDto(bill) : null;
  }

  async getOneByName(
    userId: string,
    name: string
  ): Promise<RecurringBillDto | null> {
    const bill = await this.datasource.getByName(userId, name);
    return bill ? mapRecurringBillModelToDto(bill) : null;
  }

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedRecurringBillsResponseDto> {
    const resp = await this.datasource.getPaginated(userId, params);
    return { data: resp.data.map(mapRecurringBillModelToDto), meta: resp.meta };
  }

  async updateOne(
    userId: string,
    billId: string,
    input: UpdateRecurringBillDto
  ): Promise<RecurringBillDto> {
    const current = await this.getAndMapBill(userId, billId);
    const update = this.buildUpdateBill(current, input);
    await this.datasource.updateOne(userId, billId, update);
    return this.getAndMapBill(userId, billId);
  }

  async deleteOne(userId: string, billId: string): Promise<void> {
    await this.datasource.deleteOne(userId, billId);
  }

  // #########################################################
  // # Analytics & Buckets
  // #########################################################

  async getTotalAmount(
    userId: string,
    offset?: RecurringBillsOffsetDto
  ): Promise<number> {
    // Simple approach: sum amounts of all bills or filtered by RRULE occurrences in range
    // For now, sum base amounts for bills in range by dtstart/until
    const all = await this.datasource.getAll(userId);
    const start = offset?.start ? Timestamp.fromDate(offset.start) : undefined;
    const end = offset?.end ? Timestamp.fromDate(offset.end) : undefined;
    const filtered = all.filter((b) => {
      const afterStart = !start || b.dtstart >= start;
      const beforeEnd = !end || (b.until ? b.until <= end : true);
      return afterStart && beforeEnd;
    });
    return filtered.reduce((sum, b) => sum + b.amount, 0);
  }

  private isOccurrenceInRange(
    rruleStr: string,
    dtstart: Date,
    start?: Date,
    end?: Date
  ): boolean {
    try {
      const rule = RRule.fromString(rruleStr);
      rule.options.dtstart = dtstart;
      const between = rule.between(start ?? dtstart, end ?? new Date(), true);
      return between.length > 0;
    } catch {
      return false;
    }
  }

  private computeBuckets(
    bills: RecurringBillModel[],
    now: Date,
    dueSoonDays: number,
    offset?: RecurringBillsOffsetDto
  ) {
    const start = offset?.start;
    const end = offset?.end;

    const paid = { count: 0, amount: 0 };
    const upcoming = { count: 0, amount: 0 };
    const dueSoon = { count: 0, amount: 0 };

    // NOTE: Without payment history lookup here, we'll treat all active bills as upcoming
    for (const b of bills) {
      const dt = b.dtstart.toDate();
      const active = this.isOccurrenceInRange(b.rrule, dt, start, end ?? now);
      if (!active) continue;

      upcoming.count += 1;
      upcoming.amount += b.amount;

      const rule = RRule.fromString(b.rrule);
      rule.options.dtstart = dt;
      const next = rule.after(now, true);
      if (next) {
        const diffDays = Math.ceil(
          (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays >= 0 && diffDays <= dueSoonDays) {
          dueSoon.count += 1;
          dueSoon.amount += b.amount;
        }
      }
    }

    return { paid, upcoming, dueSoon };
  }

  async getSummary(
    userId: string,
    offset?: RecurringBillsOffsetDto,
    dueSoonParams?: DueSoonParamsDto
  ): Promise<RecurringBillsSummaryDto> {
    const all = await this.datasource.getAll(userId);
    const now = new Date();
    const { paid, upcoming, dueSoon } = this.computeBuckets(
      all,
      now,
      dueSoonParams?.daysBeforeDue ?? 2,
      offset
    );
    return { paid, upcoming, dueSoon };
  }

  private async buildBucketResponse(
    userId: string,
    params: PaginationParams,
    filter: (b: RecurringBillModel) => boolean
  ): Promise<RecurringBillsWithTotalsDto> {
    const all = await this.datasource.getAll(userId);
    const filtered = all.filter(filter);
    const data = filtered
      .sort((a, b) => b.dtstart.toMillis() - a.dtstart.toMillis())
      .slice(
        (params.pagination.page - 1) * params.pagination.perPage,
        params.pagination.page * params.pagination.perPage
      )
      .map(mapRecurringBillModelToDto);
    const count = filtered.length;
    const amount = filtered.reduce((sum, b) => sum + b.amount, 0);
    return {
      count,
      amount,
      list: {
        data,
        meta: {
          pagination: {
            totalItems: count,
            page: params.pagination.page,
            perPage: params.pagination.perPage,
            totalPages: Math.ceil(count / params.pagination.perPage),
            nextPage: null,
            previousPage: null,
            hasNextPage:
              params.pagination.page * params.pagination.perPage < count,
            hasPrevPage: params.pagination.page > 1,
          },
        },
      },
    } as RecurringBillsWithTotalsDto;
  }

  async getPaid(
    userId: string,
    params: PaginationParams,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto> {
    // Placeholder: requires payment history to determine paid in range
    return this.buildBucketResponse(userId, params, () => false);
  }

  async getUpcoming(
    userId: string,
    params: PaginationParams,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto> {
    const now = new Date();
    return this.buildBucketResponse(userId, params, (b) =>
      this.isOccurrenceInRange(
        b.rrule,
        b.dtstart.toDate(),
        offset?.start,
        offset?.end ?? now
      )
    );
  }

  async getDueSoon(
    userId: string,
    params: PaginationParams,
    dueSoonParams: DueSoonParamsDto,
    offset?: RecurringBillsOffsetDto
  ): Promise<RecurringBillsWithTotalsDto> {
    const now = new Date();
    const days = dueSoonParams.daysBeforeDue ?? 2;
    return this.buildBucketResponse(userId, params, (b) => {
      if (
        !this.isOccurrenceInRange(
          b.rrule,
          b.dtstart.toDate(),
          offset?.start,
          offset?.end ?? now
        )
      )
        return false;
      const rule = RRule.fromString(b.rrule);
      rule.options.dtstart = b.dtstart.toDate();
      const next = rule.after(now, true);
      if (!next) return false;
      const diffDays = Math.ceil(
        (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 0 && diffDays <= days;
    });
  }

  // #########################################################
  // # Payments & Transaction
  // #########################################################

  async recordPayment(
    userId: string,
    billId: string,
    payment: CreateRecurringBillPaymentDto
  ): Promise<RecurringBillPaymentDto> {
    const model = this.buildPayment(payment);
    await this.datasource.createPayment(userId, billId, model);
    const payments = await this.datasource.getPaymentsInRange(
      userId,
      billId,
      model.occurrenceDate,
      model.occurrenceDate
    );
    const created = payments.find((p) => p.id === model.id)!;
    return mapRecurringBillPaymentModelToDto(created);
  }

  async createTransactionFromBill(
    userId: string,
    billId: string,
    payment: CreateRecurringBillPaymentDto
  ): Promise<{ transactionId: string; payment: RecurringBillPaymentDto }> {
    // 1) Load the bill details
    const bill = await this.getAndMapBill(userId, billId);

    // 2) Resolve category for expense (budgets act as expense categories)
    const budget = await this.budgetDatasource.getById(userId, bill.categoryId);
    if (!budget) {
      throw new Error("Category ID not found for budget");
    }

    const category = {
      id: budget.id,
      name: budget.name,
      colorTag: budget.colorTag,
    };

    // 3) Build and create the expense transaction
    const transactionId = generateId();
    const transactionData = {
      id: transactionId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      type: "expense" as const,
      amount: payment.amountPaid,
      signedAmount: -payment.amountPaid,
      recipientOrPayer: bill.recipientOrPayer,
      category,
      transactionDate: Timestamp.fromDate(payment.occurrenceDate),
      description: payment.note ?? bill.description,
      emoji: bill.emoji,
      name: bill.name,
    };

    await this.transactionDatasource.createOne(userId, transactionData);

    // Ensure category document exists in categories collection
    const existingCategory = await this.categoryDatasource.getById(
      userId,
      category.id
    );
    if (!existingCategory) {
      await this.categoryDatasource.createOne(userId, {
        id: category.id,
        name: category.name,
        colorTag: category.colorTag,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Update budget totals for this category
    const totalForCategory =
      await this.transactionDatasource.calculateTotalByCategory(
        userId,
        category.id
      );
    this.budgetDatasource.setTotalSpending(
      userId,
      category.id,
      totalForCategory
    );

    // 4) Record the payment linked to the created transaction
    const paymentModel = this.buildPayment(payment);
    paymentModel.transactionId = transactionId;
    await this.datasource.createPayment(userId, billId, paymentModel);

    const payments = await this.datasource.getPaymentsInRange(
      userId,
      billId,
      paymentModel.occurrenceDate,
      paymentModel.occurrenceDate
    );
    const createdPayment = payments.find((p) => p.id === paymentModel.id)!;

    return {
      transactionId,
      payment: mapRecurringBillPaymentModelToDto(createdPayment),
    };
  }
}
