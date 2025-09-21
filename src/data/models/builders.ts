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
export function buildModelSchema(
  baseSchema: ZodObject<ZodRawShape>,
  timestampFields: readonly string[],
  extraFields?: Record<string, ZodType<unknown>>
): ZodObject<ZodRawShape> {
  return baseSchema.omit(toOmitShape(timestampFields)).extend({
    ...toExtendShape(timestampFields, zTimestamp),
    ...(extraFields || {}),
  });
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
export function buildCreateModelSchema(
  modelSchema: ZodObject<ZodRawShape>,
  serverTimestampFields: readonly string[],
  regularTimestampFields: readonly string[] = []
): ZodObject<ZodRawShape> {
  const omitFields = [
    ...serverTimestampFields,
    ...(regularTimestampFields || []),
  ];
  return modelSchema.omit(toOmitShape(omitFields)).extend({
    ...toExtendShape(serverTimestampFields, zFieldValue),
    ...toExtendShape(regularTimestampFields, zTimestamp),
  });
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
