import { cn } from "@/utils";
import { PlusIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { LoadingButton } from "../LoadingButton";
import { Tooltip } from "../ToolTip";

type CreateButtonProps = React.ComponentProps<typeof LoadingButton>;

export const CreateButton = ({
  className,
  label,
  ...props
}: CreateButtonProps) => {
  const pathname = usePathname();

  return (
    <>
      <LoadingButton
        icon={{ component: PlusIcon, weight: "bold" }}
        label={label}
        className={cn("@max-lg:hidden", className)}
        {...props}
      />
      <Tooltip>
        <Tooltip.Trigger asChild>
          <LoadingButton
            icon={{ component: PlusIcon, weight: "bold" }}
            iconOnly
            className={cn("@lg:hidden", className)}
            label={label}
            {...props}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>{label}</Tooltip.Content>
      </Tooltip>
    </>
  );
};
