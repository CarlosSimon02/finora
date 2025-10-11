import { z } from "zod";
import { emailSchema, trimmedStringSchema } from "./helpers";

const passwordSchema = trimmedStringSchema
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

export const loginWithEmailCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signUpCredentialsSchema = z.object({
  name: trimmedStringSchema.min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  password: passwordSchema,
});

export const authResponseSchema = z.object({
  id: trimmedStringSchema,
  email: emailSchema,
  idToken: trimmedStringSchema,
  refreshToken: trimmedStringSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyEmailSchema = z.object({
  oobCode: trimmedStringSchema,
});

export type LoginWithEmailCredentialsDto = z.infer<
  typeof loginWithEmailCredentialsSchema
>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type SignUpCredentialsDto = z.infer<typeof signUpCredentialsSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
