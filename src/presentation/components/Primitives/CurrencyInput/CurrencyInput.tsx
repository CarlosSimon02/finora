import { cn } from "@/utils";
import * as React from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "../Input";

type CurrencyInputProps = Omit<
  React.ComponentProps<typeof NumericFormat>,
  "customInput" | "prefix"
> & {
  className?: string;
};

export const CurrencyInput = ({ className, ...props }: CurrencyInputProps) => {
  const { value, defaultValue, ...restProps } = props;
  const safeValue =
    typeof value === "string" || typeof value === "number" ? value : undefined;
  const safeDefaultValue =
    typeof defaultValue === "string" || typeof defaultValue === "number"
      ? defaultValue
      : undefined;

  return (
    <div className={cn("relative", className)}>
      <div className="text-beige-500 pointer-events-none absolute top-0 left-0 flex h-full w-10 items-center justify-center text-center">
        ₱
      </div>
      <NumericFormat
        thousandSeparator
        customInput={Input}
        displayType="input"
        className="pl-10"
        value={safeValue as string | number | undefined}
        defaultValue={safeDefaultValue as string | number | undefined}
        {...(restProps as unknown as Record<string, unknown>)}
      />
    </div>
  );
};
