"use client";

import { cn } from "@/utils";
import { ArrowClockwiseIcon, ImageBrokenIcon } from "@phosphor-icons/react";
import { Button } from "../Button";

type ErrorStateProps = {
  errorMessage?: string;
  title: string;
  className?: string;
};

export const ErrorState = ({
  errorMessage = "An error occurred, please try again later.",
  title,
  className,
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        "grid h-full place-items-center content-center gap-4 p-4",
        className
      )}
    >
      <ImageBrokenIcon
        weight="fill"
        className="text-secondary-red size-15 opacity-50"
      />
      <div className="flex flex-col gap-2 text-center">
        <p className="txt-preset-2 text-secondary-red">{title}</p>
        {errorMessage && <pre className="txt-preset-4">{errorMessage}</pre>}
      </div>
      <Button
        icon={{
          component: ArrowClockwiseIcon,
          weight: "fill",
        }}
        onClick={() => window.location.reload()}
        label="Reload Page"
      />
    </div>
  );
};
