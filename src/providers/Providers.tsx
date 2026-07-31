"use client";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/userContext";

import { QueryClientProvider, QueryClient } from "react-query";
export default function Providers({ children }: any) {
  // Create the QueryClient ONCE per app instance. Previously it was recreated
  // on every render, which threw away the entire cache and forced refetches.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch huge payloads just because the tab regained focus.
            refetchOnWindowFocus: false,
            // Treat data as fresh for 5 minutes -> avoids duplicate refetches
            // when navigating between pages that share a query.
            staleTime: 1000 * 60 * 5,
            // Keep unused data around for 10 minutes for instant back-nav.
            cacheTime: 1000 * 60 * 10,
            retry: 1,
          },
        },
      })
  );
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
