import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  CreateIncomeDto,
  IncomeDto,
  IncomesSummaryDto,
  PaginatedIncomesResponseDto,
  PaginatedIncomesWithTransactionsResponseDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { CategoryDatasource, TransactionDatasource } from "@/data/datasource";
import { IncomeDatasource } from "@/data/datasource/IncomeDatasource";
import {
  mapIncomeModelToDto,
  mapIncomeModelToDtoWithTotalEarned,
  mapTransactionModelToDto,
} from "@/data/mappers";
import { CreateIncomeModel, UpdateIncomeModel } from "@/data/models";
import { generateId, NotFoundError } from "@/utils";
import { FieldValue } from "firebase-admin/firestore";

export class IncomeRepository implements IIncomeRepository {
  private readonly incomeDatasource: IncomeDatasource;
  private readonly transactionDatasource: TransactionDatasource;
  private readonly categoryDatasource: CategoryDatasource;

  constructor() {
    this.incomeDatasource = new IncomeDatasource();
    this.transactionDatasource = new TransactionDatasource();
    this.categoryDatasource = new CategoryDatasource();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapIncome(
    userId: string,
    incomeId: string
  ): Promise<IncomeDto> {
    const income = await this.incomeDatasource.getById(userId, incomeId);
    if (!income)
      throw new NotFoundError(
        `Income ${incomeId} not found for user ${userId}`
      );
    return mapIncomeModelToDto(income);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  private async buildIncomeData(
    input: CreateIncomeDto
  ): Promise<CreateIncomeModel> {
    return {
      id: generateId(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      name: input.name,
      colorTag: input.colorTag,
      totalEarned: 0,
    };
  }

  async createOne(userId: string, input: CreateIncomeDto): Promise<IncomeDto> {
    // Prepare data
    const incomeData = await this.buildIncomeData(input);

    // Save data
    await this.incomeDatasource.createOne(userId, incomeData);

    // Return data
    return await this.getAndMapIncome(userId, incomeData.id);
  }

  // #########################################################
  // # 📃 Get One
  // #########################################################

  async getOneById(
    userId: string,
    incomeId: string
  ): Promise<IncomeDto | null> {
    // Prepare data
    const income = await this.incomeDatasource.getById(userId, incomeId);

    // Return data
    return income ? mapIncomeModelToDto(income) : null;
  }

  async getOneByName(userId: string, name: string): Promise<IncomeDto | null> {
    const income = await this.incomeDatasource.getByName(userId, name);
    return income ? mapIncomeModelToDto(income) : null;
  }

  async getOneByColor(
    userId: string,
    colorTag: string
  ): Promise<IncomeDto | null> {
    const income = await this.incomeDatasource.getByColor(userId, colorTag);
    return income ? mapIncomeModelToDto(income) : null;
  }

  // #########################################################
  // # 📗 Get Paginated
  // #########################################################

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponseDto> {
    // Prepare data
    const response = await this.incomeDatasource.getPaginated(userId, params);

    // Return data
    return {
      data: response.data.map(mapIncomeModelToDto),
      meta: response.meta,
    };
  }

  async getUsedColors(userId: string): Promise<string[]> {
    return this.incomeDatasource.getDistinctColors(userId);
  }

  // #########################################################
  // # 📗 Get Paginated With Transactions
  // #########################################################

  async getLatestTransactionsForIncome(
    userId: string,
    incomeId: string,
    maxTransactionsToShow: number = 12
  ) {
    const response = await this.transactionDatasource.getPaginated(userId, {
      sort: {
        field: "transactionDate",
        order: "desc",
      },
      pagination: {
        page: 1,
        perPage: maxTransactionsToShow,
      },
      filters: [
        {
          field: "category.id",
          operator: "==",
          value: incomeId,
        },
      ],
    });

    return response.data.map((transaction) =>
      mapTransactionModelToDto(transaction)
    );
  }

  async getPaginatedWithTransactions(
    userId: string,
    params: PaginationParams,
    maxTransactionsToShow: number = 3
  ): Promise<PaginatedIncomesWithTransactionsResponseDto> {
    const response = await this.incomeDatasource.getPaginated(userId, params);

    const incomesWithTransactions = await Promise.all(
      response.data.map(async (income) => {
        const [totalEarned, transactions] = await Promise.all([
          this.transactionDatasource.calculateTotalByCategory(
            userId,
            income.id
          ),
          this.getLatestTransactionsForIncome(
            userId,
            income.id,
            maxTransactionsToShow
          ),
        ]);

        return {
          ...mapIncomeModelToDto(income),
          transactions,
          totalEarned,
        };
      })
    );

    return {
      data: incomesWithTransactions,
      meta: response.meta,
    };
  }

  // #########################################################
  // # 📃 Update One
  // #########################################################

  private async buildUpdateData(
    currentIncome: IncomeDto,
    input: UpdateIncomeDto
  ): Promise<UpdateIncomeModel> {
    const updateData: UpdateIncomeModel = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentIncome.name) {
      updateData.name = input.name;
    }

    if (
      input.colorTag !== undefined &&
      input.colorTag !== currentIncome.colorTag
    ) {
      updateData.colorTag = input.colorTag;
    }

    return updateData;
  }

  async updateOne(
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto> {
    // Prepare data
    const currentIncome = await this.getAndMapIncome(userId, incomeId);
    const updateData = await this.buildUpdateData(currentIncome, input);

    // Update data
    await this.incomeDatasource.updateOne(userId, incomeId, updateData);

    // Side effects
    const category = await this.categoryDatasource.getById(userId, incomeId);
    if (category) {
      this.transactionDatasource.updateMultipleByCategory(userId, incomeId, {
        name: updateData.name,
        colorTag: updateData.colorTag,
      });
      this.categoryDatasource.updateOne(userId, incomeId, {
        name: updateData.name,
        colorTag: updateData.colorTag,
      });
    }
    // Return data
    return await this.getAndMapIncome(userId, incomeId);
  }

  // #########################################################
  // # 📄 Delete One
  // #########################################################

  async deleteOne(userId: string, incomeId: string): Promise<void> {
    // Side effects
    const category = await this.categoryDatasource.getById(userId, incomeId);
    if (category) {
      this.transactionDatasource.deleteMultipleByCategory(userId, incomeId);
      this.categoryDatasource.deleteOne(userId, incomeId);
    }

    // Delete data
    await this.incomeDatasource.deleteOne(userId, incomeId);
  }

  // #########################################################
  // # 📈 Get Summary
  // #########################################################

  private async getIncomesToShowInSummary(
    userId: string,
    maxIncomesToShow: number
  ) {
    const response = await this.incomeDatasource.getPaginated(userId, {
      sort: {
        field: "totalEarned",
        order: "desc",
      },
      pagination: {
        page: 1,
        perPage: maxIncomesToShow,
      },
      filters: [],
    });

    return response.data.map(mapIncomeModelToDtoWithTotalEarned);
  }

  async getSummary(
    userId: string,
    maxIncomesToShow: number = 12
  ): Promise<IncomesSummaryDto> {
    const [incomes, totalEarned, count] = await Promise.all([
      this.getIncomesToShowInSummary(userId, maxIncomesToShow),
      this.transactionDatasource.calculateTotalByType(userId, "income"),
      this.incomeDatasource.getCount(userId),
    ]);

    return {
      incomes,
      totalEarned,
      count,
    };
  }
}
