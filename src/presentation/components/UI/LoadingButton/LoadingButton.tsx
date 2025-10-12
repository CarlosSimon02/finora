"use client";

import { Button } from "@/presentation/components/Primitives/Button";
import { cn } from "@/utils";
import { CircleNotchIcon, IconProps } from "@phosphor-icons/react";
import React from "react";

type IconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & Partial<IconProps>
>;

type IconConfig = {
  component: IconComponent;
  size?: "default" | "sm";
  weight?: IconProps["weight"];
  className?: string;
  loc?: "left" | "right";
};

type BaseButtonProps = React.ComponentProps<typeof Button>;

export type LoadingButtonProps = BaseButtonProps & {
  isLoading?: boolean;
  loadingLabel?: string;
};

export const LoadingButton = ({
  isLoading = false,
  loadingLabel,
  className,
  disabled,
  icon,
  label,
  ...rest
}: LoadingButtonProps) => {
  const effectiveDisabled = Boolean(disabled || isLoading);

  const spinnerIcon: IconConfig = {
    component: CircleNotchIcon as IconComponent,
    className: "animate-spin",
    size: (icon as IconConfig)?.size ?? "default",
    weight: (icon as IconConfig)?.weight ?? "regular",
    loc: (icon as IconConfig)?.loc ?? "left",
  };

  const effectiveIcon = isLoading ? spinnerIcon : icon;

  const effectiveLabel = isLoading ? (loadingLabel ?? label) : label;

  return (
    <Button
      {...(rest as BaseButtonProps)}
      className={cn(effectiveDisabled && "opacity-50", className)}
      aria-busy={isLoading}
      aria-live="polite"
      disabled={effectiveDisabled}
      icon={effectiveIcon}
      label={effectiveLabel}
    />
  );
};
