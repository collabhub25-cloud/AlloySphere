import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Component as Background } from "@/components/ui/background-components";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollabHub - Startup Collaboration Platform",
  description: "Connect verified talents, founders, and investors. Build successful startups with trust-based collaboration, automated agreements, and milestone tracking.",
  keywords: ["CollabHub", "Startup", "Collaboration", "Founders", "Talent", "Investors", "SaaS"],
  authors: [{ name: "CollabHub Team" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "CollabHub - Startup Collaboration Platform",
    description: "Connect verified talents, founders, and investors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabHub - Startup Collaboration Platform",
    description: "Connect verified talents, founders, and investors",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Background>
          {children}
          <Toaster />
        </Background>
      </body>
    </html>
  );
}
