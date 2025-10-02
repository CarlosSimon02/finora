import { cn } from "@/utils";
import * as React from "react";

type CardProps = React.ComponentProps<"div"> & {
  variant?: "primary" | "secondary";
};

export const Card = ({
  className,
  variant = "primary",
  ...props
}: CardProps) => {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl p-5 shadow-xl sm:p-300 md:p-8",
        variant === "primary" && "text-grey-900 bg-white",
        variant === "secondary" && "bg-grey-900 text-white",
        className
      )}
      {...props}
    />
  );
};
