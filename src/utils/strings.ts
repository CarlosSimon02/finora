import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeNewLines = (key: string) => {
  return key.replace(/\\n/g, "\n");
};

export const formatDate = (
  dateInput: Date,
  options: { showTime?: boolean } = {}
): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(options.showTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }).format(dateInput);
};

export const formatCurrency = (
  amount: number,
  showPlus = false,
  currency = "PHP",
  showDecimal: boolean = true
): string => {
  const isNegative = amount < 0;
  const isPositive = amount > 0;
  const absoluteAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0,
  }).format(absoluteAmount);

  if (isNegative) return `-${formatted}`;
  if (showPlus && isPositive) return `+${formatted}`;
  return formatted;
};

export const normalizeString = (value: unknown): string => {
  return String(value ?? "").trim();
};

export const normalizeNumber = (value: unknown): number => {
  return Number(value ?? 0);
};
