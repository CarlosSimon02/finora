"use client";

import { GoogleIcon } from "@/presentation/components/Primitives";
import { LoadingButton } from "@/presentation/components/UI";
import { DatabaseIcon, DetectiveIcon } from "@phosphor-icons/react";

type AuthAltButtonsProps = {
  disabled?: boolean;
  googleLoading?: boolean;
  localLoading?: boolean;
  guestLoading?: boolean;
  googleLabel?: string;
  localLabel?: string;
  guestLabel?: string;
  googleLoadingLabel?: string;
  localLoadingLabel?: string;
  guestLoadingLabel?: string;
  onGoogleClick?: () => void;
  onLocalClick?: () => void;
  onGuestClick?: () => void;
};

export const AuthAltButtons = ({
  disabled,
  googleLoading,
  localLoading,
  guestLoading,
  googleLabel = "Proceed with Google",
  localLabel = "Use local storage",
  guestLabel = "Continue as guest",
  googleLoadingLabel = "Proceeding with Google...",
  localLoadingLabel = "Using local storage...",
  guestLoadingLabel = "Continuing as guest...",
  onGoogleClick,
  onLocalClick,
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
          icon={<GoogleIcon />}
          loadingLabel={googleLoadingLabel}
          onClick={onGoogleClick}
        >
          {googleLabel}
        </LoadingButton>
        <LoadingButton
          type="button"
          variant="secondary"
          className="w-full"
          disabled={disabled}
          isLoading={Boolean(localLoading)}
          icon={
            <DatabaseIcon
              size={24}
              weight="fill"
              className="text-other-blue size-5"
            />
          }
          loadingLabel={localLoadingLabel}
          onClick={onLocalClick}
        >
          {localLabel}
        </LoadingButton>
        <LoadingButton
          type="button"
          variant="secondary"
          className="w-full"
          disabled={disabled}
          isLoading={Boolean(guestLoading)}
          icon={
            <DetectiveIcon
              size={24}
              weight="fill"
              className="text-other-magenta size-5"
            />
          }
          loadingLabel={guestLoadingLabel}
          onClick={onGuestClick}
        >
          {guestLabel}
        </LoadingButton>
      </div>
    </>
  );
};
