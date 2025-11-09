/**
 * Transaction Type Enum
 * Represents whether a transaction is income or expense
 */
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export function isValidTransactionType(
  value: string
): value is TransactionType {
  return value === TransactionType.INCOME || value === TransactionType.EXPENSE;
}
