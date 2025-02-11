import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import dynamic from "next/dynamic";
export const metadata = {
  metadataBase: "Perfit Pharma",
  title: "Saas",
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
