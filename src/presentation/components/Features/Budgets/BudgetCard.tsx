import { BudgetWithTransactionsDto } from "@/core/schemas/budgetSchema";
import { Card } from "@/presentation/components/Primitives";
import Link from "next/link";
import { TransactionEmoji } from "../Transactions";
import { BudgetCardActions } from "./BudgetCardActions";

interface BudgetCardProps {
  budget: BudgetWithTransactionsDto;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const remaining =
    Math.abs(budget.maximumSpending) - Math.abs(budget.totalSpending);
  const percentSpent =
    (Math.abs(budget.totalSpending) / Math.abs(budget.maximumSpending)) * 100;
  const transactions = budget.transactions;

  return (
    <Card>
      <div className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: budget.colorTag }}
          />
          <h3 className="font-medium">{budget.name}</h3>
        </div>
        <BudgetCardActions budget={budget} />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            Maximum of ₱{budget.maximumSpending.toLocaleString()}
          </p>
          <div className="bg-muted h-2 w-full rounded-full">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${Math.min(100, percentSpent)}%`,
                backgroundColor: budget.colorTag,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Spent</p>
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: budget.colorTag }}
              />
              <p className="font-medium">
                ₱{Math.abs(budget.totalSpending).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Remaining</p>
            <div className="flex items-center gap-2">
              <div className="bg-muted h-8 w-1 rounded-full" />
              <p className="font-medium">₱{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Latest Spending</h4>
              <Link href="#" className="text-primary text-xs hover:underline">
                See all
              </Link>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TransactionEmoji emoji={transaction.emoji} />
                      <span className="text-sm">{transaction.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        -₱{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {transaction.transactionDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
