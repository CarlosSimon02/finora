type FrontViewLayoutProps = {
  title: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

export const FrontViewLayout = ({
  title,
  actions,
  children,
}: FrontViewLayoutProps) => {
  return (
    <div className="@container flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="txt-preset-1 text-grey-900">{title}</h1>
        {actions}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
