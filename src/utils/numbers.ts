export const safeNumber = (value: unknown): number =>
  Number.isFinite(value as number) ? (value as number) : 0;
