import {
  createMockTransactionRepository,
  resetRepositoryMocks,
} from "@/__tests__/utils/mockRepositories";
import {
  createPaginatedCategoriesResponse,
  createTestDate,
  createValidPaginationParams,
} from "@/__tests__/utils/testFactories";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { CategoryDto } from "@/core/schemas";
import { getPaginatedCategories } from "@/core/useCases/transaction/getPaginatedCategories";
import { AuthError, DomainValidationError } from "@/utils";
import { beforeEach, describe, expect, it, Mocked } from "vitest";

/**
 * getPaginatedCategories Use Case Tests
 * Testing business logic and authorization
 * Following: Mock all dependencies, test behaviors
 */

describe("getPaginatedCategories", () => {
  // Test doubles
  let mockRepository: Mocked<ITransactionRepository>;
  let useCase: ReturnType<typeof getPaginatedCategories>;

  // Test data
  const validUserId = "user-123";
  const validPaginationParams = createValidPaginationParams();

  beforeEach(() => {
    mockRepository = createMockTransactionRepository();
    useCase = getPaginatedCategories(mockRepository);
  });

  describe("happy path", () => {
    it("should retrieve paginated categories with valid input", async () => {
      // Arrange
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Food & Dining",
          colorTag: "#277C78",
          createdAt: createTestDate(-10),
          updatedAt: createTestDate(-5),
        },
        {
          id: "cat-2",
          name: "Transportation",
          colorTag: "#F2CDAC",
          createdAt: createTestDate(-8),
          updatedAt: createTestDate(-3),
        },
      ];
      const expectedResponse = createPaginatedCategoriesResponse(categories, 2);
      mockRepository.getPaginatedCategories.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
        validUserId,
        validPaginationParams
      );
      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledTimes(1);
    });

    it("should return empty data array when no categories found", async () => {
      // Arrange
      const emptyResponse = createPaginatedCategoriesResponse([], 0);
      mockRepository.getPaginatedCategories.mockResolvedValue(emptyResponse);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.data).toEqual([]);
      expect(result.meta.pagination.totalItems).toBe(0);
    });

    it("should retrieve categories with custom pagination", async () => {
      // Arrange
      const customParams = createValidPaginationParams({
        pagination: { page: 2, perPage: 15 },
      });
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Shopping",
          colorTag: "#934F6F",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
      ];
      const expectedResponse = createPaginatedCategoriesResponse(
        categories,
        20
      );
      mockRepository.getPaginatedCategories.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: customParams });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
        validUserId,
        customParams
      );
    });

    it("should retrieve categories with sorting", async () => {
      // Arrange
      const paramsWithSort = createValidPaginationParams({
        sort: { field: "name", order: "asc" },
      });
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Entertainment",
          colorTag: "#277C78",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
        {
          id: "cat-2",
          name: "Food",
          colorTag: "#277C78",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
      ];
      const expectedResponse = createPaginatedCategoriesResponse(categories, 2);
      mockRepository.getPaginatedCategories.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: paramsWithSort });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
        validUserId,
        paramsWithSort
      );
    });

    it("should retrieve categories with filters", async () => {
      // Arrange
      const paramsWithFilters = createValidPaginationParams({
        filters: [{ field: "colorTag", operator: "==", value: "#277C78" }],
      });
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Green Category",
          colorTag: "#277C78",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
      ];
      const expectedResponse = createPaginatedCategoriesResponse(categories, 1);
      mockRepository.getPaginatedCategories.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: paramsWithFilters });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
        validUserId,
        paramsWithFilters
      );
    });

    it("should retrieve categories with search query", async () => {
      // Arrange
      const paramsWithSearch = createValidPaginationParams({
        search: "food",
      });
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Food & Dining",
          colorTag: "#277C78",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
      ];
      const expectedResponse = createPaginatedCategoriesResponse(categories, 1);
      mockRepository.getPaginatedCategories.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: paramsWithSearch });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
        validUserId,
        paramsWithSearch
      );
    });

    it("should pass through repository result unchanged", async () => {
      // Arrange
      const customResponse = createPaginatedCategoriesResponse(
        [
          {
            id: "cat-custom",
            name: "Custom Category",
            colorTag: "#277C78",
            createdAt: createTestDate(),
            updatedAt: createTestDate(),
          },
        ],
        50
      );
      mockRepository.getPaginatedCategories.mockResolvedValue(customResponse);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result).toBe(customResponse);
    });
  });

  describe("authorization", () => {
    it("should throw AuthError when userId is empty string", async () => {
      // Arrange
      const emptyUserId = "";

      // Act & Assert
      await expect(
        useCase(emptyUserId, { params: validPaginationParams })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginatedCategories).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is null", async () => {
      // Act & Assert
      await expect(
        useCase(null as any, { params: validPaginationParams })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginatedCategories).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(undefined as any, { params: validPaginationParams })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginatedCategories).not.toHaveBeenCalled();
    });
  });

  describe("params validation", () => {
    it("should throw DomainValidationError when params is null", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { params: null as any })
      ).rejects.toThrow(DomainValidationError);
      await expect(
        useCase(validUserId, { params: null as any })
      ).rejects.toThrow("Pagination params are required");

      expect(mockRepository.getPaginatedCategories).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when params is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { params: undefined as any })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.getPaginatedCategories).not.toHaveBeenCalled();
    });
  });

  describe("repository integration", () => {
    it("should propagate repository errors", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.getPaginatedCategories.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        useCase(validUserId, { params: validPaginationParams })
      ).rejects.toThrow("Database connection failed");

      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledTimes(1);
    });

    it("should handle repository timeout errors", async () => {
      // Arrange
      const timeoutError = new Error("Query timeout");
      mockRepository.getPaginatedCategories.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(
        useCase(validUserId, { params: validPaginationParams })
      ).rejects.toThrow("Query timeout");

      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
        validUserId,
        validPaginationParams
      );
    });
  });

  describe("pagination metadata", () => {
    it("should return correct pagination metadata for first page", async () => {
      // Arrange
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Category 1",
          colorTag: "#277C78",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
      ];
      const response = createPaginatedCategoriesResponse(categories, 30);
      mockRepository.getPaginatedCategories.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.meta.pagination.page).toBe(1);
      expect(result.meta.pagination.totalItems).toBe(30);
      expect(result.meta.pagination.hasNextPage).toBe(true);
      expect(result.meta.pagination.hasPrevPage).toBe(false);
    });

    it("should handle large category datasets", async () => {
      // Arrange
      const categories: CategoryDto[] = Array.from({ length: 10 }, (_, i) => ({
        id: `cat-${i}`,
        name: `Category ${i}`,
        colorTag: "#277C78",
        createdAt: createTestDate(),
        updatedAt: createTestDate(),
      }));
      const response = createPaginatedCategoriesResponse(categories, 500);
      mockRepository.getPaginatedCategories.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.data).toHaveLength(10);
      expect(result.meta.pagination.totalItems).toBe(500);
      expect(result.meta.pagination.totalPages).toBeGreaterThan(1);
    });
  });

  describe("edge cases", () => {
    it("should handle pagination for different users", async () => {
      // Arrange
      const userIds = ["user-1", "user-2", "user-3"];

      for (const userId of userIds) {
        resetRepositoryMocks(mockRepository);
        const response = createPaginatedCategoriesResponse(
          [
            {
              id: "cat-1",
              name: "Category",
              colorTag: "#277C78",
              createdAt: createTestDate(),
              updatedAt: createTestDate(),
            },
          ],
          1
        );
        mockRepository.getPaginatedCategories.mockResolvedValue(response);

        // Act
        const result = await useCase(userId, {
          params: validPaginationParams,
        });

        // Assert
        expect(result).toEqual(response);
        expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
          userId,
          validPaginationParams
        );
      }
    });

    it("should handle categories with different color tags", async () => {
      // Arrange
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Red Category",
          colorTag: "#277C78",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
        {
          id: "cat-2",
          name: "Blue Category",
          colorTag: "#F2CDAC",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
        {
          id: "cat-3",
          name: "Green Category",
          colorTag: "#82C9D7",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
      ];
      const response = createPaginatedCategoriesResponse(categories, 3);
      mockRepository.getPaginatedCategories.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.data).toHaveLength(3);
      expect(result.data[0].colorTag).toBe("#277C78");
      expect(result.data[1].colorTag).toBe("#F2CDAC");
      expect(result.data[2].colorTag).toBe("#82C9D7");
    });

    it("should handle pagination with maximum perPage", async () => {
      // Arrange
      const maxParams = createValidPaginationParams({
        pagination: { page: 1, perPage: 100 },
      });
      const categories: CategoryDto[] = Array.from({ length: 100 }, (_, i) => ({
        id: `cat-${i}`,
        name: `Category ${i}`,
        colorTag: "#82C9D7",
        createdAt: createTestDate(),
        updatedAt: createTestDate(),
      }));
      const response = createPaginatedCategoriesResponse(categories, 100);
      mockRepository.getPaginatedCategories.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, { params: maxParams });

      // Assert
      expect(result.data).toHaveLength(100);
      expect(mockRepository.getPaginatedCategories).toHaveBeenCalledWith(
        validUserId,
        maxParams
      );
    });

    it("should handle categories with special characters in names", async () => {
      // Arrange
      const categories: CategoryDto[] = [
        {
          id: "cat-1",
          name: "Food & Dining",
          colorTag: "#277C78",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
        {
          id: "cat-2",
          name: "Health/Medical",
          colorTag: "#F2CDAC",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
        {
          id: "cat-3",
          name: "Kids' Activities",
          colorTag: "#82C9D7",
          createdAt: createTestDate(),
          updatedAt: createTestDate(),
        },
      ];
      const response = createPaginatedCategoriesResponse(categories, 3);
      mockRepository.getPaginatedCategories.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.data).toHaveLength(3);
      expect(result.data[0].name).toBe("Food & Dining");
      expect(result.data[1].name).toBe("Health/Medical");
      expect(result.data[2].name).toBe("Kids' Activities");
    });
  });

  describe("input validation order", () => {
    it("should check authorization before params validation", async () => {
      // Arrange
      const emptyUserId = "";

      // Act & Assert
      // Should throw AuthError, not DomainValidationError
      await expect(
        useCase(emptyUserId, { params: null as any })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginatedCategories).not.toHaveBeenCalled();
    });
  });
});
