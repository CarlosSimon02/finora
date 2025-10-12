import { cn } from "@/utils";
import { PlusIcon } from "@phosphor-icons/react";
import { LoadingButton } from "../LoadingButton";
import { Tooltip } from "../ToolTip";

type CreateButtonProps = React.ComponentProps<typeof LoadingButton>;

export const CreateButton = ({
  className,
  label,
  ...props
}: CreateButtonProps) => {
  return (
    <>
      <LoadingButton
        icon={{ component: PlusIcon, weight: "bold" }}
        label={label}
        className={cn("@max-md:hidden", className)}
        {...props}
      />
      <Tooltip>
        <Tooltip.Trigger asChild>
          <LoadingButton
            icon={{ component: PlusIcon, weight: "bold" }}
            iconOnly
            className={cn("@md:hidden", className)}
            label={label}
            {...props}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>{label}</Tooltip.Content>
      </Tooltip>
    </>
  );
};
