import { cn } from "@/utils";
import * as React from "react";

export const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      suppressHydrationWarning
      data-slot="textarea"
      className={cn(
        "text-preset-4 text-grey-900 border-beige-500 placeholder:text-beige-500 focus-visible:border-grey-900 aria-invalid:border-secondary-red w-full min-w-0 rounded-lg border bg-transparent px-5 py-3 transition-[color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};
