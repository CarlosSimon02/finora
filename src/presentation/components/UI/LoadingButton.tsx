"use client";

import { Button } from "@/presentation/components/Primitives";
import { cn } from "@/utils";
import { CircleNotchIcon } from "@phosphor-icons/react";
import * as React from "react";

type BaseButtonProps = React.ComponentProps<typeof Button>;

export type LoadingButtonProps = BaseButtonProps & {
  icon?: React.ReactNode | null;
  isLoading?: boolean;
  loadingLabel?: string;
};

export function LoadingButton({
  children,
  icon,
  isLoading = false,
  loadingLabel,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  const isDisabled = Boolean(disabled || isLoading);

  const renderedIcon = isLoading ? (
    <CircleNotchIcon aria-hidden className="animate-spin" />
  ) : (
    icon
  );

  return (
    <Button
      className={cn(isDisabled && "opacity-50", className)}
      aria-busy={isLoading}
      aria-live="polite"
      disabled={isDisabled}
      {...props}
    >
      {renderedIcon}
      {isLoading ? (
        <span>{loadingLabel ?? <span className="sr-only">Loading</span>}</span>
      ) : (
        children
      )}
    </Button>
  );
}
