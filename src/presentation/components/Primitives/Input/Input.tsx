import { cn } from "@/utils";
import * as React from "react";

type InputProps = React.ComponentProps<"input"> & {
  type?: "text" | "email" | "password" | "number";
};

export const Input = ({ className, type, ...props }: InputProps) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-preset-4 text-grey-900 border-beige-500 placeholder:text-beige-500 focus-visible:border-grey-900 aria-invalid:border-secondary-red w-full min-w-0 rounded-lg border bg-transparent px-5 py-3 transition-[color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};
