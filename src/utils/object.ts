export const hasKeys = (obj: object) => {
  return Object.keys(obj).length > 0;
};

export const hasObjectChanges = <T extends Record<string, unknown>>(
  current: T,
  initial: T,
  fields: Array<keyof T>,
  normalizers?: Partial<Record<keyof T, (value: unknown) => unknown>>
): boolean => {
  return fields.some((field) => {
    const currentValue = current[field];
    const initialValue = initial[field];
    const normalizer = normalizers?.[field];

    if (normalizer) {
      return normalizer(currentValue) !== normalizer(initialValue);
    }

    return currentValue !== initialValue;
  });
};
