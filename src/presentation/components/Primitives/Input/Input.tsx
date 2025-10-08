import { cn } from "@/utils";
import * as React from "react";

type InputProps = React.ComponentProps<"input"> & {
  type?: "text" | "email" | "password" | "date";
};

export const Input = ({ className, type = "text", ...props }: InputProps) => {
  return (
    <input
      type={type === "date" ? "date" : type}
      suppressHydrationWarning
      data-slot="input"
      className={cn(
        "!txt-preset-4 text-grey-900 border-beige-500 placeholder:text-beige-500 focus-visible:border-grey-900 aria-invalid:border-secondary-red h-[3.125rem] w-full min-w-0 rounded-lg border bg-transparent px-5 py-3 transition-[color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};
