import { Inter } from "next/font/google";
import { Metadata } from 'next';
import "./globals.css";
import Providers from "@/providers/Providers";
import dynamic from "next/dynamic";
export const metadata: Metadata = {
  title: "Perfit",
  description: "Perfit Application",
  manifest: "/manifest.json",
  themeColor: "#000000",
  icons: {
    apple: "/icon-192x192.png",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text-foreground  max-h-screen overflow-hidden ">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
