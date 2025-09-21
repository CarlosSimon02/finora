import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  BudgetsSummaryDto,
  CreateBudgetDto,
  PaginatedBudgetsResponseDto,
  PaginatedBudgetsWithTransactionsResponseDto,
  UpdateBudgetDto,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { CategoryDatasource, TransactionDatasource } from "@/data/datasource";
import { BudgetDatasource } from "@/data/datasource/BudgetDatasource";
import { mapBudgetModelToDto, mapTransactionModelToDto } from "@/data/mappers";
import { CreateBudgetModel, UpdateBudgetModel } from "@/data/models";
import { generateId } from "@/utils";
import { FieldValue } from "firebase-admin/firestore";

export class BudgetRepository implements IBudgetRepository {
  private readonly budgetDatasource: BudgetDatasource;
  private readonly transactionDatasource: TransactionDatasource;
  private readonly categoryDatasource: CategoryDatasource;

  constructor() {
    this.budgetDatasource = new BudgetDatasource();
    this.transactionDatasource = new TransactionDatasource();
    this.categoryDatasource = new CategoryDatasource();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapBudget(
    userId: string,
    budgetId: string
  ): Promise<BudgetDto> {
    const budget = await this.budgetDatasource.getById(userId, budgetId);
    if (!budget)
      throw new Error(`Budget ${budgetId} not found for user ${userId}`);
    return mapBudgetModelToDto(budget);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  private async buildBudgetData(
    input: CreateBudgetDto
  ): Promise<CreateBudgetModel> {
    return {
      id: generateId(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      name: input.name,
      maximumSpending: input.maximumSpending,
      colorTag: input.colorTag,
      totalSpending: 0,
    };
  }

  async createOne(userId: string, input: CreateBudgetDto): Promise<BudgetDto> {
    const budgetData = await this.buildBudgetData(input);
    await this.budgetDatasource.createOne(userId, budgetData);
    return this.getAndMapBudget(userId, budgetData.id);
  }

  // #########################################################
  // # 📃 Get One By Id
  // #########################################################

  async getOneById(
    userId: string,
    budgetId: string
  ): Promise<BudgetDto | null> {
    const budget = await this.budgetDatasource.getById(userId, budgetId);
    return budget ? mapBudgetModelToDto(budget) : null;
  }

  async getOneByName(userId: string, name: string): Promise<BudgetDto | null> {
    const budget = await this.budgetDatasource.getByName(userId, name);
    return budget ? mapBudgetModelToDto(budget) : null;
  }

  // #########################################################
  // # 📗 Get Paginated
  // #########################################################

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponseDto> {
    const response = await this.budgetDatasource.getPaginated(userId, params);
    return {
      data: response.data.map(mapBudgetModelToDto),
      meta: response.meta,
    };
  }

  // #########################################################
  // # 📗 Get Paginated With Transactions
  // #########################################################

  async getLatestTransactionsForBudget(
    userId: string,
    budgetId: string,
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
          value: budgetId,
        },
      ],
    });

    return response.data.map((t) => mapTransactionModelToDto(t));
  }

  async getPaginatedWithTransactions(
    userId: string,
    params: PaginationParams,
    maxTransactionsToShow: number = 3
  ): Promise<PaginatedBudgetsWithTransactionsResponseDto> {
    const response = await this.budgetDatasource.getPaginated(userId, params);

    const budgetsWithTransactions = await Promise.all(
      response.data.map(async (budget) => {
        const [totalSpending, transactions] = await Promise.all([
          this.transactionDatasource.calculateTotalByCategory(
            userId,
            budget.id
          ),
          this.getLatestTransactionsForBudget(
            userId,
            budget.id,
            maxTransactionsToShow
          ),
        ]);

        return {
          ...mapBudgetModelToDto(budget),
          transactions,
          totalSpending,
        };
      })
    );

    return {
      data: budgetsWithTransactions,
      meta: response.meta,
    };
  }

  // #########################################################
  // # 📃 Update One
  // #########################################################

  private async buildUpdateData(
    currentBudget: BudgetDto,
    input: UpdateBudgetDto
  ): Promise<UpdateBudgetModel> {
    const updateData: UpdateBudgetModel = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentBudget.name) {
      updateData.name = input.name;
    }

    if (
      input.maximumSpending !== undefined &&
      input.maximumSpending !== currentBudget.maximumSpending
    ) {
      updateData.maximumSpending = input.maximumSpending;
    }

    if (
      input.colorTag !== undefined &&
      input.colorTag !== currentBudget.colorTag
    ) {
      updateData.colorTag = input.colorTag;
    }

    return updateData;
  }

  async updateOne(
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto> {
    const currentBudget = await this.getAndMapBudget(userId, budgetId);
    const updateData = await this.buildUpdateData(currentBudget, input);
    await this.budgetDatasource.updateOne(userId, budgetId, updateData);

    if (updateData.name || updateData.colorTag) {
      const category = await this.categoryDatasource.getById(userId, budgetId);
      if (category) {
        this.transactionDatasource.updateMultipleByCategory(userId, budgetId, {
          name: updateData.name,
          colorTag: updateData.colorTag,
        });
      }
      this.categoryDatasource.updateOne(userId, budgetId, {
        name: updateData.name,
        colorTag: updateData.colorTag,
      });
    }

    return this.getAndMapBudget(userId, budgetId);
  }

  // #########################################################
  // # 📄 Delete One
  // #########################################################

  async deleteOne(userId: string, budgetId: string): Promise<void> {
    const category = await this.categoryDatasource.getById(userId, budgetId);
    if (category) {
      this.transactionDatasource.deleteMultipleByCategory(userId, budgetId);
      this.categoryDatasource.deleteOne(userId, budgetId);
    }
    await this.budgetDatasource.deleteOne(userId, budgetId);
  }

  // #########################################################
  // # 📈 Get Summary
  // #########################################################

  private async getBudgetsToShowInSummary(
    userId: string,
    maxBudgetsToShow: number
  ) {
    const response = await this.budgetDatasource.getPaginated(userId, {
      sort: {
        field: "totalSpending",
        order: "asc",
      },
      pagination: {
        page: 1,
        perPage: maxBudgetsToShow,
      },
      filters: [],
    });

    const budgetsWithTransactions = await Promise.all(
      response.data.map(async (budget) => {
        const totalSpending =
          await this.transactionDatasource.calculateTotalByCategory(
            userId,
            budget.id
          );

        return {
          ...mapBudgetModelToDto(budget),
          totalSpending,
        };
      })
    );

    return budgetsWithTransactions;
  }

  async getSummary(
    userId: string,
    maxBudgetsToShow: number = 12
  ): Promise<BudgetsSummaryDto> {
    const [budgets, totalSpending, totalMaxSpending, count] = await Promise.all(
      [
        this.getBudgetsToShowInSummary(userId, maxBudgetsToShow),
        this.transactionDatasource.calculateTotalByType(userId, "expense"),
        this.budgetDatasource.getTotalMaxSpending(userId),
        this.budgetDatasource.getCount(userId),
      ]
    );

    return {
      totalSpending,
      totalMaxSpending,
      budgets,
      count,
    };
  }
}
