import { z } from "zod";
import { baseEntitySchema, trimmedStringSchema } from "./helpers";

export const userSchema = baseEntitySchema.extend({
  email: trimmedStringSchema,
  displayName: trimmedStringSchema.optional().nullable(),
  photoURL: trimmedStringSchema.optional().nullable(),
  phoneNumber: trimmedStringSchema.optional().nullable(),
  customClaims: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const createUserSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.partial();

export type UserDto = z.infer<typeof userSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type User = CreateUserDto;
