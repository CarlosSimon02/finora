"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // duration={Infinity}
      closeButton={true}
      // richColors
      className="toaster group bg-bg-secondary text-fg-primary"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-grey-900 group-[.toaster]:text-white group-[.toaster]:shadow-lg backdrop-blur-md",
          description: "group-[.toast]:text-white",
          actionButton: "group-[.toast]:bg-grey-900 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-grey-900 group-[.toast]:text-white",
          closeButton: "group-[.toast]:bg-grey-900 group-[.toast]:text-white",
          success:
            "group-[.toast]:bg-secondary-green group-[.toast]:border-secondary-green/30",
          error:
            "group-[.toast]:bg-secondary-red group-[.toast]:border-secondary-red/30",
          info: "group-[.toast]:bg-secondary-navy group-[.toast]:border-secondary-navy/30",
          warning:
            "group-[.toast]:bg-secondary-yellow group-[.toast]:border-secondary-yellow/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
