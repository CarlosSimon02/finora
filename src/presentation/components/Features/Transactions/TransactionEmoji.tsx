"use client";

import { cn } from "@/utils";

type TransactionEmojiProps = {
  className?: string;
  emoji: string;
};

export const TransactionEmoji = ({
  emoji,
  className,
}: TransactionEmojiProps) => {
  return (
    <div
      className={cn(
        "bg-grey-100 flex h-10 w-10 items-center justify-center rounded-full",
        className
      )}
    >
      <span className="text-xl">{emoji}</span>
    </div>
  );
};
