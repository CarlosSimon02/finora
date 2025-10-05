import { IconProps } from "@phosphor-icons/react";

type EmptyStateProps = {
  title: string;
  message: string;
  icon: React.ComponentType<IconProps>;
  action: React.ReactNode;
};

export const EmptyState = ({
  title,
  message,
  icon: Icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="grid place-items-center gap-6 p-4 py-10">
      <div className="bg-grey-100 grid place-items-center rounded-full p-10">
        <Icon className="text-grey-500 size-15" />
      </div>
      <div className="space-y-2 text-center">
        <p className="txt-preset-2 text-grey-900">{title}</p>
        <p className="txt-preset-4 text-grey-500">{message}</p>
      </div>
      {action}
    </div>
  );
};
