import { BudgetsSummaryDto, BudgetWithTransactionsDto } from "@/core/schemas";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import { Pagination } from "@/presentation/components/UI";
import { BudgetCard } from "./BudgetCard";
import { CreateBudgetDialog } from "./CreateBudgetDialog";
import { SpendingSummaryCard } from "./SpendingSummaryCard";

export const Budgets = () => {
  const tempBudgetsSummary: BudgetsSummaryDto = {
    totalMaxSpending: 1000,
    totalSpending: 500,
    count: 3,
    budgets: [
      {
        id: "1",
        name: "Budget 1",
        colorTag: "#277C78",
        totalSpending: 100,
        maximumSpending: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Budget 2",
        colorTag: "#F2CDAC",
        totalSpending: 200,
        maximumSpending: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Budget 3",
        colorTag: "#82C9D7",
        totalSpending: 300,
        maximumSpending: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  const tempBudgetsWithTransactions: BudgetWithTransactionsDto[] = [
    {
      ...tempBudgetsSummary.budgets[0],
      transactions: [
        {
          id: "1",
          name: "Transaction 1",
          amount: 100,
          type: "expense",
          recipientOrPayer: "Transaction 1",
          transactionDate: new Date(),
          description: "Transaction 1",
          emoji: "💰",
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: "1",
            name: "Category 1",
            colorTag: "#277C78",
          },
        },
      ],
    },
    {
      ...tempBudgetsSummary.budgets[1],
      transactions: [
        {
          id: "2",
          name: "Transaction 2",
          amount: 200,
          type: "expense",
          recipientOrPayer: "Transaction 2",
          transactionDate: new Date(),
          description: "Transaction 2",
          emoji: "💰",
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: "2",
            name: "Category 2",
            colorTag: "#F2CDAC",
          },
        },
      ],
    },
    {
      ...tempBudgetsSummary.budgets[2],
      transactions: [
        {
          id: "3",
          name: "Transaction 3",
          amount: 300,
          type: "expense",
          recipientOrPayer: "Transaction 3",
          transactionDate: new Date(),
          description: "Transaction 3",
          emoji: "💰",
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: "3",
            name: "Category 3",
            colorTag: "#82C9D7",
          },
        },
      ],
    },
  ];

  return (
    <FrontViewLayout title="Budgets" actions={<CreateBudgetDialog />}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SpendingSummaryCard budgetsSummary={tempBudgetsSummary} />
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {tempBudgetsWithTransactions.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>

            {tempBudgetsWithTransactions.length > 1 && (
              <Pagination currentPage={1} totalPages={1} />
            )}
          </div>
        </div>
      </div>
    </FrontViewLayout>
  );
};
