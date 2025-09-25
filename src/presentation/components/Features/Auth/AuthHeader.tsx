import { Logo } from "@/presentation/components/Primitives";
import { cn } from "@/utils";

type AuthHeaderProps = {
  className?: string;
};

export const AuthHeader = ({ className }: AuthHeaderProps) => {
  return (
    <header
      className={cn(
        "bg-grey-900 flex items-center justify-center rounded-b-2xl px-200 py-300",
        className
      )}
    >
      <Logo className="h-[1.36rem]" />
    </header>
  );
};
