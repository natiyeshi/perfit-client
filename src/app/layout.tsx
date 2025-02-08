import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
const defaultUrl = process.env.VERCEL_URL
? `https://${process.env.VERCEL_URL}`
: "http://localhost:3000";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: "Perfit",
  title: "Saas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text-foreground  ">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
