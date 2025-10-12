"use client";

import { cn } from "@/utils";

type EmojiProps = {
  className?: string;
  emoji: string;
};

export const Emoji = ({ emoji, className }: EmojiProps) => {
  return (
    <div
      className={cn(
        "bg-grey-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        className
      )}
    >
      <span className="text-xl">{emoji}</span>
    </div>
  );
};
