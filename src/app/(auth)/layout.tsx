import doodle from "@/assets/svgs/doodle.svg";
import {
  AuthHeader,
  AuthIllustration,
} from "@/presentation/components/Features/Auth";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ backgroundImage: `url(${doodle.src})` }}
      />
      <AuthHeader className="fixed top-0 z-10 w-full lg:hidden" />
      <main className="mx-auto flex min-h-[100dvh] w-full flex-1 max-lg:pt-[4.36041875rem] lg:h-full">
        <div className="min-h-[56rem] max-w-[35rem] flex-1 px-200 py-300 pr-0 max-lg:hidden lg:py-200">
          <AuthIllustration className="h-full" />
        </div>
        <div className="flex w-full flex-1 items-center justify-center px-200 py-300 lg:min-h-[56rem] lg:flex-[1.5] lg:px-16 lg:py-200">
          {children}
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
