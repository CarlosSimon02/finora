"use client";

import { logoutAction, refreshCredentialsAction } from "@/presentation/actions";
import { Button, Card } from "@/presentation/components/Primitives";
import { LoadingButton } from "@/presentation/components/UI";
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

  const reloadPage = () => {
    // Full reload (triggers middleware)
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-[35rem]">
      <h2 className="txt-preset-1">Verify your email</h2>
      <p className="txt-preset-4 text-grey-500 mt-2">
        {sent
          ? "We have sent a verification link to your email address. Please check your inbox."
          : 'Click "Send verification email" to send a verification link to your email address.'}{" "}
        After verifying your email, please refresh your credentials to continue.
      </p>

      <div className="mt-8 space-y-4">
        {resent && (
          <p className="txt-preset-4 text-secondary-green text-center">
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
          label={sent ? "Resend verification email" : "Send verification email"}
        />
        <Button
          type="button"
          className="w-full"
          variant="secondary"
          onClick={async () => {
            await refreshCredentialsAction();
            reloadPage();
          }}
          label="Refresh Credentials"
        />
        <p className="txt-preset-4 text-grey-500 text-center">
          Wrong email?{" "}
          <Button
            variant="link"
            onClick={async () => {
              await logoutAction();
              router.push("/signup");
            }}
            label="Create a new account"
          />
        </p>
      </div>
    </Card>
  );
};
