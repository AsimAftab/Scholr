import "./globals.css";
import type { Metadata, Viewport } from "next";

import { AppProvider } from "@/providers/app-provider";

export const metadata: Metadata = {
  title: "Scholr",
  description: "AI-powered scholarship matching platform",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#18181b",
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

