import { cn } from "@/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

export const Label = ({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      suppressHydrationWarning
      className={cn(
        "txt-preset-5-bold text-grey-500 w-fit select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};
