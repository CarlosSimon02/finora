"use client";

import { Button } from "@/presentation/components/Primitives";
import { cn } from "@/utils";
import { UserIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

type FrontViewLayoutProps = {
  title: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

export const FrontViewLayout = ({
  title,
  actions,
  children,
}: FrontViewLayoutProps) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "@container flex flex-col gap-8",
        pathname.startsWith("/account") && "mx-auto max-w-2xl"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            className={cn(
              "md:hidden",
              pathname.startsWith("/account") && "hidden"
            )}
            variant="secondary"
            iconOnly
            label="Account"
            icon={{ component: UserIcon }}
            href="/account"
            prefetch={true}
          />
          <h1 className="txt-preset-1 text-grey-900">{title}</h1>
        </div>
        {actions}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
