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
      <div className="flex h-[100dvh] w-full flex-col">
        <main className="w-full flex-1">
          <div className="relative p-200 [&>*]:container [&>*]:mx-auto">
            {children}
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
};

export default FrontLayout;
