import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeNewLines = (key: string) => {
  return key.replace(/\\n/g, "\n");
};

export const formatCurrency = (
  amount: number,
  showPlus = false,
  currency = "PHP"
): string => {
  const isNegative = amount < 0;
  const isPositive = amount > 0;
  const absoluteAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(absoluteAmount);

  if (isNegative) return `-${formatted}`;
  if (showPlus && isPositive) return `+${formatted}`;
  return formatted;
};

export const formatDate = (dateInput: Date): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateInput);
};
