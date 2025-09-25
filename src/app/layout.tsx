import { PUBLIC_SANS } from "@/constants/fonts";
import { TailwindScreenIndicator } from "@/presentation/components/UI";
import "@/presentation/styles/main.css";

const fontClasses = PUBLIC_SANS.variable;

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      className={fontClasses}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <TailwindScreenIndicator />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
