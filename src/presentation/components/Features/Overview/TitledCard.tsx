"use client";

import { Button, Card } from "@/presentation/components/Primitives";
import { cn } from "@/utils";
import { CaretRightIcon } from "@phosphor-icons/react";

type TitledCardProps = {
  children?: React.ReactNode;
  className?: string;
  title: string;
  href: string;
};

export const TitledCard = ({
  children,
  className,
  title,
  href,
}: TitledCardProps) => {
  return (
    <Card className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-row flex-wrap items-center justify-between gap-x-5 gap-y-2 pb-2">
        <h2 className="txt-preset-2">{title}</h2>
        <Button
          label="See Details"
          href={href}
          variant="tertiary"
          icon={{
            component: CaretRightIcon,
            loc: "right",
            weight: "fill",
            size: "sm",
          }}
        />
      </div>
      {children}
    </Card>
  );
};
