import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  cn(
    "txt-preset-4-bold p-200 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg transition-colors disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
    "aria-invalid:border-secondary-red"
  ),
  {
    variants: {
      variant: {
        primary: "bg-grey-900 text-white hover:bg-grey-500",
        secondary:
          "bg-beige-100 text-grey-900 border border-transparent hover:border-beige-500 hover:bg-transparent",
        // tertiary:
        //   "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        // destructive:
        //   "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export const Button = ({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
};
