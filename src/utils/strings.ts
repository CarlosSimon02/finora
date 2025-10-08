import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeNewLines = (key: string) => {
  return key.replace(/\\n/g, "\n");
};

export const formatDate = (dateInput: Date): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateInput);
};

export const formatCurrency = (
  amount: number,
  options: {
    showPlus?: boolean;
    currency?: string;
    showDecimal?: boolean;
  } = {}
): string => {
  const { showPlus = false, currency = "PHP", showDecimal = true } = options;

  const isNegative = amount < 0;
  const isPositive = amount > 0;
  const absoluteAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currency,
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

export const toInputDateString = (val?: Date | string | null) => {
  if (!val) return "";
  const d = val instanceof Date ? val : new Date(val);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const fromInputDateString = (val?: string | null) => {
  if (!val) return null;
  return new Date(val);
};
