"use client";

import {
  LoginWithEmailCredentialsDto,
  SignUpCredentialsDto,
  VerifyEmailDto,
  verifyEmailSchema,
} from "@/core/schemas/authSchema";
import {
  logInWithEmail,
  resetPassword,
  sendEmailVerification,
  signInWithGoogle,
  signUpWithEmail,
  verifyEmail,
} from "@/core/useCases/auth/client";
import { AuthClientRepository } from "@/data/repositories/AuthClientRepository";
import { postSignInAction } from "@/presentation/actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const authClientRepository = new AuthClientRepository();

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message || "An error occurred");
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "An unexpected error occurred";
  }
};

const useRedirectParam = () => {
  const params = useSearchParams();
  return params.get("redirect");
};

export const useGoogleSignIn = () => {
  const redirect = useRedirectParam();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const authEntity = await signInWithGoogle(authClientRepository)();
      const response = await postSignInAction(authEntity.idToken);
      if (response.error) throw new Error(response.error);
      return authEntity;
    },
    onSuccess: () => {
      toast.success("Signed in with Google successfully!");
      router.push(redirect ?? "/");
    },
    onError: (error: unknown) => {
      console.error("Google sign-in error:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useLogin = () => {
  const redirect = useRedirectParam();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginWithEmailCredentialsDto) => {
      const authEntity =
        await logInWithEmail(authClientRepository)(credentials);
      const response = await postSignInAction(authEntity.idToken);
      if (response.error) throw new Error(response.error);
      return authEntity;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      router.push(redirect ?? "/");
    },
    onError: (error: unknown) => {
      console.error("Login error:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useSignUp = () => {
  const redirect = useRedirectParam();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpCredentialsDto) => {
      const authEntity = await signUpWithEmail(authClientRepository)(data);
      const response = await postSignInAction(authEntity.idToken, {
        name: data.name,
      });
      if (response.error) throw new Error(response.error);
      return authEntity;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push(redirect ?? "/");
    },
    onError: (error: unknown) => {
      console.error("Sign up error:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await resetPassword(authClientRepository)(email);
    },
    onSuccess: () => {
      toast.success("Password reset email sent successfully!");
    },
    onError: (error: unknown) => {
      console.error("Password reset error:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useSendEmailVerification = () => {
  return useMutation({
    mutationFn: async () => {
      await sendEmailVerification(authClientRepository)();
    },
    onSuccess: () => {
      toast.success("Verification email sent.");
    },
    onError: (error: unknown) => {
      console.error("Send email verification error:", error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useVerifyEmailWithCode = () => {
  return useMutation({
    mutationFn: async (payload: VerifyEmailDto) => {
      const { oobCode } = verifyEmailSchema.parse(payload);
      await verifyEmail(authClientRepository)(oobCode);
    },
    onSuccess: () => {
      toast.success("Email verified successfully.");
    },
    onError: (error: unknown) => {
      console.error("Verify email error:", error);
      toast.error(getErrorMessage(error));
    },
  });
};
