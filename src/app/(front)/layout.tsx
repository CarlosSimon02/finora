import {
  AppSidebar,
  SidebarProvider,
} from "@/presentation/components/Features/AppSidebar";

type FrontLayoutProps = {
  children: React.ReactNode;
};

const FrontLayout = ({ children }: FrontLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-4 [&>*]:container [&>*]:mx-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default FrontLayout;
