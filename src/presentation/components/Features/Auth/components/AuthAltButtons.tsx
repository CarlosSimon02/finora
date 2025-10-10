"use client";

import { GoogleIcon } from "@/presentation/components/SVGs";
import { LoadingButton } from "@/presentation/components/UI";
import { DetectiveIcon } from "@phosphor-icons/react";

type AuthAltButtonsProps = {
  disabled?: boolean;
  googleLoading?: boolean;
  localLoading?: boolean;
  guestLoading?: boolean;
  googleLabel?: string;
  localLabel?: string;
  guestLabel?: string;
  googleLoadingLabel?: string;
  guestLoadingLabel?: string;
  onGoogleClick?: () => void;
  onGuestClick?: () => void;
};

export const AuthAltButtons = ({
  disabled,
  googleLoading,
  guestLoading,
  googleLabel = "Proceed with Google",
  guestLabel = "Continue as guest",
  googleLoadingLabel = "Proceeding with Google...",
  guestLoadingLabel = "Continuing as guest...",
  onGoogleClick,
  onGuestClick,
}: AuthAltButtonsProps) => {
  return (
    <>
      <div className="txt-preset-4 text-grey-500 shrink-0 text-center">
        or continue with
      </div>
      <div className="space-y-2">
        <LoadingButton
          type="button"
          variant="secondary"
          className="w-full"
          disabled={disabled}
          isLoading={Boolean(googleLoading)}
          icon={{ component: GoogleIcon }}
          loadingLabel={googleLoadingLabel}
          onClick={onGoogleClick}
          label={googleLabel}
        />
        <LoadingButton
          type="button"
          variant="secondary"
          className="w-full"
          disabled={disabled}
          isLoading={Boolean(guestLoading)}
          icon={{
            component: DetectiveIcon,
            weight: "fill",
            className: "text-other-magenta size-5",
          }}
          loadingLabel={guestLoadingLabel}
          onClick={onGuestClick}
          label={guestLabel}
        />
      </div>
    </>
  );
};
