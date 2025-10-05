"use client";

import { ArrowClockwiseIcon, ImageBrokenIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button } from "../Button";

export const ErrorState = () => {
  const router = useRouter();
  return (
    <div className="grid place-items-center gap-6 p-4 py-10">
      <div className="bg-secondary-red/10 grid place-items-center rounded-full p-10">
        <ImageBrokenIcon className="text-secondary-red size-15" />
      </div>
      <div className="space-y-2 text-center">
        <p className="txt-preset-2 text-grey-900">Something went wrong</p>
        <p className="txt-preset-4 text-grey-500">
          Don't worry, we'll fix it. Please try again later.
        </p>
      </div>
      <Button
        onClick={() => router.refresh()}
        label="Try again"
        icon={{ component: ArrowClockwiseIcon }}
      />
    </div>
  );
};
