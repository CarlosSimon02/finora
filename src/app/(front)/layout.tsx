import {
  AppSidebar,
  MobileBottomNav,
  SidebarProvider,
} from "@/presentation/components/Features/AppSidebar";

type FrontLayoutProps = {
  children: React.ReactNode;
};

const FrontLayout = ({ children }: FrontLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full pb-16 md:pb-0">
        <div className="p-4 [&>*]:container [&>*]:mx-auto">{children}</div>
      </main>
      <MobileBottomNav />
    </SidebarProvider>
  );
};

export default FrontLayout;
