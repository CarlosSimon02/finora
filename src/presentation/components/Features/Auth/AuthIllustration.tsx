import illuastrationImage from "@/assets/svgs/illustrationImage.svg";
import { Logo } from "@/presentation/components/Primitives";
import { cn } from "@/utils";
import Image from "next/image";

type AuthIllustrationProps = {
  className?: string;
};

export const AuthIllustration = ({ className }: AuthIllustrationProps) => {
  return (
    <div
      className={cn(
        "bg-grey-900 relative h-full w-full overflow-clip rounded-2xl",
        className
      )}
    >
      <Image
        src={illuastrationImage}
        alt="Auth Illustration"
        width={560}
        height={920}
        className="pointer-events-none h-full w-full object-contain object-top"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-start justify-between p-500">
        <Logo className="h-[1.36rem]" />
        <div className="flex flex-col gap-300">
          <h1 className="txt-preset-1 text-white">
            Keep track of your money and save for your future
          </h1>
          <p className="txt-preset-4 text-white">
            Finora app puts you in control of your spending. Track transactions,
            set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
    </div>
  );
};
