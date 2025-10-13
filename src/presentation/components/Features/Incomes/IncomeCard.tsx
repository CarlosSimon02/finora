"use client";

import { IncomeWithTransactionsDto } from "@/core/schemas";
import { ItemCard } from "@/presentation/components/UI";
import { encodeForUrlParam, formatCurrency } from "@/utils";
import { IncomeCardActions } from "./IncomeCardActions";

type IncomeCardProps = {
  income: IncomeWithTransactionsDto;
};

export const IncomeCard = ({ income }: IncomeCardProps) => {
  const transactions = income.transactions;

  return (
    <ItemCard>
      <ItemCard.Header
        name={income.name}
        colorTag={income.colorTag}
        actions={<IncomeCardActions income={income} />}
      />
      <p className="txt-preset-4 text-grey-500">
        Total Earned:{" "}
        <span className="txt-preset-3-bold">
          {formatCurrency(income.totalEarned)}
        </span>
      </p>
      <ItemCard.TransactionsList
        transactions={transactions}
        seeAllHref={`/transactions?filters=[{"field"%3A"category.name"%2C"operator"%3A"%3D%3D"%2C"value"%3A"${encodeForUrlParam(income.name)}"}]`}
        title="Latest Earnings"
        emptyColorTag={income.colorTag}
      />
    </ItemCard>
  );
};
