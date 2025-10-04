"use client";

import { ForgotPasswordDto, forgotPasswordSchema } from "@/core/schemas";
import { Button, Card, Input } from "@/presentation/components/Primitives";
import { Form, LoadingButton } from "@/presentation/components/UI";
import { useResetPassword } from "@/presentation/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@phosphor-icons/react";
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
            className="bg-secondary-green/10 text-secondary-green mb-4 inline-block rounded-full p-3"
            aria-hidden
          >
            <CheckIcon size={30} />
          </div>
          <h3 className="txt-preset-3">Check your email</h3>
          <p className="txt-preset-4 text-grey-500 mt-2">
            We have sent a password reset link to {submittedEmail}
          </p>
          <div className="mt-6">
            <Button href="/login" label="Back to login" variant="link" />
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <Form.InputField
              control={form.control}
              name="email"
              label="Email Address"
              inputComponent={({ field }) => <Input {...field} type="email" />}
              disabled={isLoading}
            />

            <LoadingButton
              type="submit"
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
              loadingLabel="Sending..."
              label="Reset Password"
            />

            <div className="txt-preset-4 text-grey-500 text-center">
              Remember your password?{" "}
              <Button href="/login" label="Back to login" variant="link" />
            </div>
          </form>
        </Form>
      )}
    </Card>
  );
};
