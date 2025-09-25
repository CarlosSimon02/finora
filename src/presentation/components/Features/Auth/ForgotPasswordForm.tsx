"use client";

import { ForgotPasswordDto, forgotPasswordSchema } from "@/core/schemas";
import { InlineLink } from "@/presentation/components/Primitives";
import {
  Card,
  Form,
  InputField,
  LoadingButton,
} from "@/presentation/components/UI";
import { useResetPassword } from "@/presentation/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

export const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const reset = useResetPassword();

  const onSubmit = async (data: ForgotPasswordDto) => {
    await reset.mutateAsync(data.email);
    setSubmittedEmail(data.email);
    setIsSubmitted(true);
  };

  const isLoading = reset.isPending;

  return (
    <Card className="w-full max-w-[35rem]">
      <h2 className="txt-preset-1">Reset your password</h2>
      {isSubmitted ? (
        <div className="mt-8 text-center">
          <div
            className="mb-4 inline-block rounded-full bg-green-100 p-3 text-green-500"
            aria-hidden
          >
            ✓
          </div>
          <h3 className="txt-preset-3">Check your email</h3>
          <p className="txt-preset-4 text-grey-500 mt-2">
            We\'ve sent a password reset link to {submittedEmail}
          </p>
          <div className="mt-6">
            <InlineLink href="/login">Back to sign in</InlineLink>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <InputField
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              disabled={isLoading}
            />

            <LoadingButton
              type="submit"
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
              loadingLabel="Sending..."
            >
              Reset Password
            </LoadingButton>

            <div className="txt-preset-4 text-grey-500 text-center">
              Remember your password?{" "}
              <InlineLink href="/login">Back to sign in</InlineLink>
            </div>
          </form>
        </Form>
      )}
    </Card>
  );
};
