"use client";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/userContext";

import { QueryClientProvider, QueryClient } from "react-query";
export default function Providers({ children }: any) {
  const queryClient = new QueryClient();
  return (
    <>
      <NextTopLoader />
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Toaster />
          {children}
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}
