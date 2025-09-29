"use client";

import { Input } from "@/presentation/components/Primitives";
import { Tooltip } from "@/presentation/components/UI";
import { cn } from "@/utils";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type={showPassword ? "text" : "password"}
        className="pr-[3.125rem]"
        {...props}
      />
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button
              className="text-grey-900 hover:text-grey-500 absolute top-0 right-0 h-full px-4 transition-colors"
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon size={20} weight="fill" />
              ) : (
                <EyeIcon size={20} weight="fill" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>{showPassword ? "Hide password" : "Show password"}</p>
          </Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>
    </div>
  );
};
