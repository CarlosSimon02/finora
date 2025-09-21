import { userSchema } from "@/core/schemas";
import { z } from "zod";
import {
  buildCreateModelSchema,
  buildModelSchema,
  buildUpdateModelSchema,
} from "./builders";

export const userModelSchema = buildModelSchema(userSchema, [
  "createdAt",
  "updatedAt",
]);

export const createUserModelSchema = buildCreateModelSchema(userModelSchema, [
  "createdAt",
  "updatedAt",
]);

export const updateUserModelSchema = buildUpdateModelSchema(userModelSchema, {
  serverTimestampFields: ["createdAt", "updatedAt"],
});

export type UserModel = z.infer<typeof userModelSchema>;
export type CreateUserModel = z.infer<typeof createUserModelSchema>;
export type UpdateUserModel = z.infer<typeof updateUserModelSchema>;
