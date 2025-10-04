"use client";

import { COLOR_MAP, ColorLabel } from "@/constants/colors";
import { cn } from "@/utils";
import { GhostIcon } from "@phosphor-icons/react";

type EmptyStateProps = {
  message: string;
  className?: string;
  color?: ColorLabel;
};

export const EmptyState = ({
  message,
  className,
  color = "Cyan",
}: EmptyStateProps) => {
  const hex = color ? COLOR_MAP[color] : undefined;
  return (
    <div
      className={cn(
        "grid h-full place-items-center content-center p-4",
        className
      )}
    >
      <GhostIcon
        weight="fill"
        className="size-10 opacity-50"
        style={{ color: hex }}
      />
      <p className="txt-preset-4 text-grey-300">{message}</p>
    </div>
  );
};
