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
      <main className="w-full flex-1 pb-[3.25rem] sm:pb-[4.375rem] md:pb-0">
        <div className="relative container mx-auto px-200 py-300 xl:px-500 xl:py-400">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </SidebarProvider>
  );
};

export default FrontLayout;
