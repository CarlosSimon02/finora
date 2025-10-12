"use client";

import { Popover } from "@/presentation/components/UI";
import { cn } from "@/utils";
import EmojiPickerComponent, { EmojiClickData } from "emoji-picker-react";

type EmojiPickerProps = {
  value: string;
  onChange: (emoji: string) => void;
  disabled?: boolean;
  className?: string;
};

export const EmojiPicker = ({
  value,
  onChange,
  disabled,
  className,
}: EmojiPickerProps) => {
  const currentEmoji = value || "📃";

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
  };

  return (
    <Popover>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "border-beige-500 focus-visible:border-grey-900 hover:border-grey-900 aria-invalid:border-secondary-red w-full rounded-lg border p-2 text-center text-2xl disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          disabled={disabled}
          type="button"
        >
          {currentEmoji}
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-full p-0" align="start" side="bottom">
        <EmojiPickerComponent
          autoFocusSearch={false}
          onEmojiClick={handleEmojiClick}
          width="100%"
          height="24rem"
        />
      </Popover.Content>
    </Popover>
  );
};
