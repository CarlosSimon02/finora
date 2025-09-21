import { z } from "zod";

export function validateOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown,
  context: string
): z.infer<T> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;

  const details = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");

  throw new Error(`${context} validation failed: ${details}`);
}
