import "./globals.css";
import type { Metadata } from "next";

import { AppProvider } from "@/providers/app-provider";

export const metadata: Metadata = {
  title: "Scholr",
  description: "AI-powered scholarship matching platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

