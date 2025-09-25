import { cn } from "@/utils";
import * as React from "react";

type CardProps = React.ComponentProps<"div">;

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl bg-white p-250 shadow-xl sm:p-300 md:p-400",
        className
      )}
      {...props}
    />
  );
};
