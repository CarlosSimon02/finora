"use client";

import { Button, InlineLink } from "@/presentation/components/Primitives";
import { Card, LoadingButton } from "@/presentation/components/UI";
import { useSendEmailVerification } from "@/presentation/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export const VerifyEmailForm = () => {
  const [resent, setResent] = React.useState(false);
  const resend = useSendEmailVerification();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sent = params.get("sent") === "true";

  const onResend = async () => {
    await resend.mutateAsync();
    setResent(true);
    const newParams = new URLSearchParams(params.toString());
    newParams.set("sent", "true");
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <Card className="w-full max-w-[35rem]">
      <h2 className="txt-preset-1">Verify your email</h2>
      <p className="txt-preset-4 text-grey-500 mt-2">
        {sent
          ? "We have sent a verification link to your email address. Please check"
          : 'Click "Send verification email" to send a verification link to your email address.'}{" "}
        After verifying your email, please reload this page to continue.
      </p>

      <div className="mt-8 space-y-4">
        {resent && (
          <p className="txt-preset-4 text-center text-green-600">
            Verification email sent. Check your inbox.
          </p>
        )}
        <LoadingButton
          type="button"
          className="w-full"
          isLoading={resend.isPending}
          loadingLabel={sent ? "Resending..." : "Sending..."}
          onClick={onResend}
          disabled={resend.isPending}
        >
          {sent ? "Resend verification email" : "Send verification email"}
        </LoadingButton>
        <Button
          type="button"
          className="w-full"
          variant="secondary"
          onClick={() => router.refresh()}
        >
          Reload page
        </Button>
        <p className="txt-preset-4 text-grey-500 text-center">
          Wrong email?{" "}
          <InlineLink href="/signup">Create a new account</InlineLink>
        </p>
      </div>
    </Card>
  );
};
