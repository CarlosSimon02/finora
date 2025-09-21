import { z } from "zod";

const emailSchema = z.email({ message: "Please enter a valid email address" });

export const loginWithEmailCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

export const signUpCredentialsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: emailSchema,
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export const authResponseSchema = z.object({
  id: z.string(),
  email: emailSchema,
  idToken: z.string(),
  refreshToken: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginWithEmailCredentialsDto = z.infer<
  typeof loginWithEmailCredentialsSchema
>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type SignUpCredentialsDto = z.infer<typeof signUpCredentialsSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;
