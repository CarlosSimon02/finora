import { z } from "zod";
import { trimmedStringSchema } from "./helpers";

export const userSchema = z.object({
  id: trimmedStringSchema,
  email: trimmedStringSchema,
  displayName: trimmedStringSchema.optional().nullable(),
  photoURL: trimmedStringSchema.optional().nullable(),
  phoneNumber: trimmedStringSchema.optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customClaims: z.record(trimmedStringSchema, z.any()).optional().nullable(),
});

export const createUserSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.partial();

export type UserDto = z.infer<typeof userSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type User = CreateUserDto;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
