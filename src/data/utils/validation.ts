import { z } from "zod";

export function validateOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  input: unknown,
  context: string
): z.infer<T> {
  const result = schema.safeParse(input);
  if (result.success) return result.data as z.infer<T>;
  const details = (result.error as z.ZodError).issues
    .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
    .join(", ");
  throw new Error(`${context} validation failed: ${details}`);
}
