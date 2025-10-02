"use client";

type TransactionEmojiProps = {
  emoji: string;
};

export const TransactionEmoji = ({ emoji }: TransactionEmojiProps) => {
  return (
    <div className="bg-grey-100 flex h-10 w-10 items-center justify-center rounded-full">
      <span className="text-xl">{emoji}</span>
    </div>
  );
};
