"use client";

import { InlineLink } from "@/presentation/components/Primitives";
import { Card, LoadingButton } from "@/presentation/components/UI";
import { useSendEmailVerification } from "@/presentation/hooks";
import * as React from "react";

export const VerifyEmailForm = () => {
  const [resent, setResent] = React.useState(false);
  const resend = useSendEmailVerification();

  const onResend = async () => {
    await resend.mutateAsync();
    setResent(true);
  };

  return (
    <Card className="w-full max-w-[35rem]">
      <h2 className="txt-preset-1">Verify your email</h2>
      <p className="txt-preset-4 text-grey-500 mt-2">
        We have sent a verification link to your email address. Please check
        your inbox and click the link to verify your account.
      </p>

      <div className="mt-8 space-y-4">
        <LoadingButton
          type="button"
          className="w-full"
          isLoading={resend.isPending}
          loadingLabel="Resending..."
          onClick={onResend}
          disabled={resend.isPending}
        >
          Resend verification email
        </LoadingButton>
        {resent && (
          <p className="txt-preset-4 text-center text-green-600">
            Verification email sent. Check your inbox.
          </p>
        )}
        <p className="txt-preset-4 text-grey-500 text-center">
          Wrong email?{" "}
          <InlineLink href="/signup">Create a new account</InlineLink>
        </p>
      </div>
    </Card>
  );
};
