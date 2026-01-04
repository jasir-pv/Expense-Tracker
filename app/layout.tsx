import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker - Manage Your Finances",
  description: "A modern fintech-style expense tracker built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
