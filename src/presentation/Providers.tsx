"use client";

import { User } from "@/core/schemas";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { AuthProvider, TrpcProvider } from "./contexts";

type ProvidersProps = {
  children: React.ReactNode;
  user: User | null;
};

export const Providers = ({ children, user }: ProvidersProps) => {
  return (
    <AuthProvider user={user}>
      <TrpcProvider>
        {children}
        {process.env.NODE_ENV !== "production" ? <ReactQueryDevtools /> : null}
      </TrpcProvider>
    </AuthProvider>
  );
};
