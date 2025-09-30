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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="txt-preset-1 text-grey-900">{title}</h1>
        {actions}
      </div>
      <div>{children}</div>
    </div>
  );
};
