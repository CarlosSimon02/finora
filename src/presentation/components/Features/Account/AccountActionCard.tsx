"use client";

import { IconProps } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface AccountActionCardProps {
  icon: React.ComponentType<IconProps>;
  iconClassName: string;
  title: string;
  description: string;
  action: ReactNode;
}

export const AccountActionCard = ({
  icon: Icon,
  iconClassName,
  title,
  description,
  action,
}: AccountActionCardProps) => {
  return (
    <div className="border-grey-100 flex flex-col gap-4 border-b py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12 ${iconClassName}`}
        >
          <Icon weight="fill" className="size-5 text-white sm:size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="txt-preset-4-bold text-grey-900 truncate">{title}</p>
          <p className="txt-preset-5 text-grey-500 break-words">
            {description}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 justify-end sm:justify-start">{action}</div>
    </div>
  );
};
