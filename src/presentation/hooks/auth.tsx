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
import { trpc } from "@/lib/trpc/client";
import {
  isIgnorableAuthError,
  normalizeAuthError,
  sanitizeRedirect,
} from "@/presentation/utils/authErrors";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const authClientRepository = new AuthClientRepository();

const useRedirectParam = () => {
  const params = useSearchParams();
  return sanitizeRedirect(params.get("redirect"));
};

export const useGoogleSignIn = () => {
  const redirect = useRedirectParam();
  const router = useRouter();
  const postSignIn = trpc.postSignIn.useMutation();

  return useMutation({
    mutationKey: ["auth", "google"],
    retry: 1,
    mutationFn: async () => {
      const authEntity = await signInWithGoogle(authClientRepository)();
      await postSignIn.mutateAsync({ idToken: authEntity.idToken });
      return authEntity;
    },
    onSuccess: () => {
      toast.success("Signed in with Google successfully!");
      router.push(redirect);
    },
    onError: (error: unknown) => {
      if (isIgnorableAuthError(error)) return;
      console.error("Google sign-in error:", error);
      toast.error(normalizeAuthError(error));
    },
    onSettled: () => {},
  });
};

export const useLogin = () => {
  const redirect = useRedirectParam();
  const router = useRouter();
  const postSignIn = trpc.postSignIn.useMutation();

  return useMutation({
    mutationKey: ["auth", "login"],
    retry: 1,
    mutationFn: async (credentials: LoginWithEmailCredentialsDto) => {
      const authEntity =
        await logInWithEmail(authClientRepository)(credentials);
      await postSignIn.mutateAsync({ idToken: authEntity.idToken });
      return authEntity;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      router.push(redirect);
    },
    onError: (error: unknown) => {
      console.error("Login error:", error);
      toast.error(normalizeAuthError(error));
    },
    onSettled: () => {},
  });
};

export const useSignUp = () => {
  const router = useRouter();
  const postSignIn = trpc.postSignIn.useMutation();

  return useMutation({
    mutationKey: ["auth", "signup"],
    retry: 1,
    mutationFn: async (data: SignUpCredentialsDto) => {
      const authEntity = await signUpWithEmail(authClientRepository)(data);
      await postSignIn.mutateAsync({
        idToken: authEntity.idToken,
        additionalInfo: { name: data.name },
      });
      await sendEmailVerification(authClientRepository)();
      return authEntity;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/verify-email?sent=true");
    },
    onError: (error: unknown) => {
      console.error("Sign up error:", error);
      toast.error(normalizeAuthError(error));
    },
    onSettled: () => {},
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["auth", "resetPassword"],
    retry: 1,
    mutationFn: async (email: string) => {
      await resetPassword(authClientRepository)(email);
    },
    onSuccess: () => {
      toast.success("Password reset email sent successfully!");
    },
    onError: (error: unknown) => {
      console.error("Password reset error:", error);
      toast.error(normalizeAuthError(error));
    },
    onSettled: () => {},
  });
};

export const useSendEmailVerification = () => {
  return useMutation({
    mutationKey: ["auth", "sendEmailVerification"],
    retry: 1,
    mutationFn: async () => {
      await sendEmailVerification(authClientRepository)();
    },
    onError: (error: unknown) => {
      console.error("Send email verification error:", error);
      toast.error(normalizeAuthError(error));
    },
    onSettled: () => {},
  });
};

export const useVerifyEmailWithCode = () => {
  return useMutation({
    mutationKey: ["auth", "verifyEmailWithCode"],
    retry: 1,
    mutationFn: async (payload: VerifyEmailDto) => {
      const { oobCode } = verifyEmailSchema.parse(payload);
      await verifyEmail(authClientRepository)(oobCode);
    },
    onSuccess: () => {
      toast.success("Email verified successfully.");
    },
    onError: (error: unknown) => {
      console.error("Verify email error:", error);
      toast.error(normalizeAuthError(error));
    },
    onSettled: () => {},
  });
};
