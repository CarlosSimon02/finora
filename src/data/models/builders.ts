import { type ZodObject, type ZodRawShape, type ZodType } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

/**
 * Utility: Converts an array of field names into an "omit shape" object
 * that Zod's `.omit()` understands.
 *
 * Example:
 *   toOmitShape(["createdAt", "updatedAt"])
 *   -> { createdAt: true, updatedAt: true }
 */
const toOmitShape = (
  fields: readonly string[]
): Partial<Record<string, true>> =>
  Object.fromEntries(fields.map((f) => [f, true]));

/**
 * Utility: Converts an array of field names into an "extend shape" object
 * that Zod's `.extend()` understands.
 *
 * Example:
 *   toExtendShape(["createdAt", "updatedAt"], zTimestamp)
 *   -> { createdAt: zTimestamp, updatedAt: zTimestamp }
 */
const toExtendShape = (
  fields: readonly string[],
  schema: ZodType<unknown>
): Record<string, ZodType<unknown>> =>
  Object.fromEntries(fields.map((f) => [f, schema]));

/**
 * Builds a **base model schema** by:
 * 1. Taking an existing schema (e.g., from your domain model).
 * 2. Removing timestamp fields (`createdAt`, `updatedAt`, etc).
 * 3. Replacing them with `zTimestamp`.
 * 4. Optionally adding extra fields if needed.
 *
 * Use this for defining the "canonical" version of a model
 * that matches how it's stored/retrieved from your database.
 *
 * Example:
 *   const incomeModelSchema = buildModelSchema(incomeSchema, ["createdAt", "updatedAt"]);
 *
 *   // Result:
 *   // - Uses incomeSchema fields
 *   // - Replaces createdAt/updatedAt with zTimestamp
 */
export function buildModelSchema<
  S extends ZodRawShape,
  K extends keyof S,
  E extends ZodRawShape = {},
>(
  baseSchema: ZodObject<S>,
  timestampFields: readonly K[],
  extraFields?: E
): ZodObject<Omit<S, K> & { [P in K]: ZodType<unknown> } & E> {
  const omitted = baseSchema.omit(
    toOmitShape(timestampFields as readonly string[])
  ) as unknown as ZodObject<Omit<S, K>>;
  const withTimestamps = omitted.extend(
    toExtendShape(timestampFields as readonly string[], zTimestamp)
  ) as unknown as ZodObject<Omit<S, K> & { [P in K]: ZodType<unknown> }>;
  const extended = extraFields
    ? (withTimestamps.extend(extraFields) as unknown as ZodObject<
        Omit<S, K> & { [P in K]: ZodType<unknown> } & E
      >)
    : (withTimestamps as ZodObject<
        Omit<S, K> & { [P in K]: ZodType<unknown> } & E
      >);
  return extended;
}

/**
 * Builds a **create schema** for new documents/records.
 *
 * Differences from the base model:
 * - Omits both server-managed and client-managed timestamp fields.
 * - Replaces server-managed timestamps with `zFieldValue` (Firebase-style server timestamp).
 * - Replaces regular timestamps with `zTimestamp` (client-provided).
 *
 * Use this when validating API payloads for "create" requests.
 *
 * Example:
 *   const createIncomeSchema = buildCreateModelSchema(incomeModelSchema, ["createdAt", "updatedAt"]);
 *
 *   // Result:
 *   // - createdAt, updatedAt -> zFieldValue (server will fill)
 */
export function buildCreateModelSchema<
  S extends ZodRawShape,
  K1 extends keyof S,
  K2 extends keyof S = never,
>(
  modelSchema: ZodObject<S>,
  serverTimestampFields: readonly K1[],
  regularTimestampFields: readonly K2[] = [] as unknown as readonly K2[]
): ZodObject<
  Omit<S, K1 | K2> & { [P in K1]: ZodType<unknown> } & {
    [P in K2]: ZodType<unknown>;
  }
> {
  const omitFields = [
    ...(serverTimestampFields as readonly string[]),
    ...((regularTimestampFields as unknown as readonly string[]) || []),
  ];
  const omitted = modelSchema.omit(
    toOmitShape(omitFields)
  ) as unknown as ZodObject<Omit<S, K1 | K2>>;
  const withServer = omitted.extend(
    toExtendShape(serverTimestampFields as readonly string[], zFieldValue)
  ) as unknown as ZodObject<Omit<S, K1 | K2> & { [P in K1]: ZodType<unknown> }>;
  const withRegular = withServer.extend(
    toExtendShape(regularTimestampFields as readonly string[], zTimestamp)
  ) as unknown as ZodObject<
    Omit<S, K1 | K2> & { [P in K1]: ZodType<unknown> } & {
      [P in K2]: ZodType<unknown>;
    }
  >;
  return withRegular;
}

/**
 * Builds an **update schema** for partial document updates.
 *
 * Differences from the base model:
 * - Omits immutable fields (fields that should never be updated, like totals).
 * - Omits server-managed timestamps.
 * - Replaces server-managed timestamps with `zFieldValue`.
 * - Makes all fields optional via `.partial()` (since in updates you usually send only the fields you want to change).
 *
 * Use this for validating "update" payloads.
 *
 * Example:
 *   const updateIncomeSchema = buildUpdateModelSchema(incomeModelSchema, {
 *     immutableFields: ["totalEarned"],
 *     serverTimestampFields: ["createdAt", "updatedAt"]
 *   });
 *
 *   // Result:
 *   // - totalEarned is omitted (cannot be updated)
 *   // - createdAt, updatedAt -> zFieldValue
 *   // - All other fields optional
 */
export function buildUpdateModelSchema(
  modelSchema: ZodObject<ZodRawShape>,
  options: {
    immutableFields?: readonly string[];
    serverTimestampFields: readonly string[];
  }
): ZodObject<ZodRawShape> {
  const { immutableFields = [], serverTimestampFields } = options;
  return modelSchema
    .omit(toOmitShape([...immutableFields, ...serverTimestampFields]))
    .extend({
      ...toExtendShape(serverTimestampFields, zFieldValue),
    })
    .partial();
}
