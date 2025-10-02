import { PUBLIC_SANS } from "@/constants/fonts";
import { getAuthTokens, tokensToUser } from "@/lib/auth/authTokens";
import { TailwindScreenIndicator } from "@/presentation/components/Dev";
import { Toaster } from "@/presentation/components/Primitives";
import { Providers } from "@/presentation/Providers";
import "@/presentation/styles/main.css";

const fontClasses = PUBLIC_SANS.variable;

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const tokens = await getAuthTokens();
  const user = tokens ? tokensToUser(tokens.decodedToken) : null;

  return (
    <html
      className={fontClasses}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="bg-beige-100" suppressHydrationWarning>
        <TailwindScreenIndicator />
        <Providers user={user}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
