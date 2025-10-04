"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // duration={Infinity}
      closeButton={true}
      richColors
      className="toaster group bg-bg-secondary text-fg-primary"
      toastOptions={{
        classNames: {
          success:
            "!text-secondary-green !border-current [&>button]:!border-current [&>button]:!text-secondary-green",
          error:
            "!text-secondary-red !border-current [&>button]:!border-current [&>button]:!text-secondary-red",
          info: "!text-secondary-navy !border-current [&>button]:!border-current [&>button]:!text-secondary-navy",
          warning:
            "!text-secondary-gold !border-current [&>button]:!border-current [&>button]:!text-secondary-gold",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
