import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  CreatePotDto,
  PaginatedPotsResponseDto,
  PaginationParams,
  PotDto,
  PotsSummaryDto,
  UpdatePotDto,
} from "@/core/schemas";
import { PotDatasource } from "@/data/datasource/PotDatasource";
import { mapPotModelToDto } from "@/data/mappers";
import { CreatePotModel, UpdatePotModel } from "@/data/models";
import { generateId } from "@/utils";
import { FieldValue } from "firebase-admin/firestore";

export class PotRepository implements IPotRepository {
  private readonly potDatasource: PotDatasource;

  constructor() {
    this.potDatasource = new PotDatasource();
  }

  // #########################################################
  // # 🛠️ Helper Methods
  // #########################################################

  private async getAndMapPot(userId: string, potId: string): Promise<PotDto> {
    const pot = await this.potDatasource.getById(userId, potId);
    if (!pot) throw new Error(`Pot ${potId} not found for user ${userId}`);
    return mapPotModelToDto(pot);
  }

  // #########################################################
  // # 📝 Create One
  // #########################################################

  private async buildPotData(input: CreatePotDto): Promise<CreatePotModel> {
    return {
      id: generateId(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      name: input.name,
      colorTag: input.colorTag,
      target: input.target,
      totalSaved: 0,
    };
  }

  async createOne(userId: string, input: CreatePotDto): Promise<PotDto> {
    const potData = await this.buildPotData(input);
    await this.potDatasource.createOne(userId, potData);
    return this.getAndMapPot(userId, potData.id);
  }

  // #########################################################
  // # 📃 Get One By Id
  // #########################################################

  async getOneById(userId: string, potId: string): Promise<PotDto | null> {
    const pot = await this.potDatasource.getById(userId, potId);
    return pot ? mapPotModelToDto(pot) : null;
  }

  async getOneByName(userId: string, name: string): Promise<PotDto | null> {
    const pot = await this.potDatasource.getByName(userId, name);
    return pot ? mapPotModelToDto(pot) : null;
  }

  async getOneByColor(
    userId: string,
    colorTag: string
  ): Promise<PotDto | null> {
    const pot = await this.potDatasource.getByColor(userId, colorTag);
    return pot ? mapPotModelToDto(pot) : null;
  }

  // #########################################################
  // # 📗 Get Paginated
  // #########################################################

  async getPaginated(
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedPotsResponseDto> {
    const response = await this.potDatasource.getPaginated(userId, params);
    return { data: response.data.map(mapPotModelToDto), meta: response.meta };
  }

  async getUsedColors(userId: string): Promise<string[]> {
    return this.potDatasource.getDistinctColors(userId);
  }

  async getCount(userId: string): Promise<number> {
    return this.potDatasource.getCount(userId);
  }

  // #########################################################
  // # 📃 Update One
  // #########################################################

  private async buildUpdateData(
    currentPot: PotDto,
    input: UpdatePotDto
  ): Promise<UpdatePotModel> {
    const updateData: UpdatePotModel = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (input.name !== undefined && input.name !== currentPot.name) {
      updateData.name = input.name;
    }

    if (
      input.colorTag !== undefined &&
      input.colorTag !== currentPot.colorTag
    ) {
      updateData.colorTag = input.colorTag;
    }

    if (input.target !== undefined && input.target !== currentPot.target) {
      updateData.target = input.target;
    }

    return updateData;
  }

  async updateOne(
    userId: string,
    potId: string,
    input: UpdatePotDto
  ): Promise<PotDto> {
    const currentPot = await this.getAndMapPot(userId, potId);
    const updateData = await this.buildUpdateData(currentPot, input);
    await this.potDatasource.updateOne(userId, potId, updateData);
    return this.getAndMapPot(userId, potId);
  }

  // #########################################################
  // # 📄 Delete One
  // #########################################################

  async deleteOne(userId: string, potId: string): Promise<void> {
    await this.potDatasource.deleteOne(userId, potId);
  }

  // #########################################################
  // # 💰 Money Operations
  // #########################################################

  async addToTotalSaved(
    userId: string,
    potId: string,
    amount: number
  ): Promise<PotDto> {
    await this.potDatasource.addToTotalSaved(userId, potId, amount);
    return this.getAndMapPot(userId, potId);
  }

  async withdrawMoney(
    userId: string,
    potId: string,
    amount: number
  ): Promise<PotDto> {
    await this.potDatasource.subtractFromTotalSaved(userId, potId, amount);
    return this.getAndMapPot(userId, potId);
  }

  // #########################################################
  // # 📈 Get Summary
  // #########################################################

  private async getPotsToShowInSummary(userId: string, maxPotsToShow: number) {
    const response = await this.potDatasource.getPaginated(userId, {
      sort: {
        field: "totalSaved",
        order: "desc",
      },
      pagination: {
        page: 1,
        perPage: maxPotsToShow,
      },
      filters: [],
    });

    return response.data.map(mapPotModelToDto);
  }

  async getSummary(
    userId: string,
    maxPotsToShow: number = 12
  ): Promise<PotsSummaryDto> {
    const [pots, totalSaved, count] = await Promise.all([
      this.getPotsToShowInSummary(userId, maxPotsToShow),
      this.potDatasource.getTotalSaved(userId),
      this.potDatasource.getCount(userId),
    ]);

    return {
      pots,
      totalSaved,
      count,
    };
  }
}
