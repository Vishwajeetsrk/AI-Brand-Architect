import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07081a",
};

export const metadata: Metadata = {
  title: "NEXORA - AI Brand Architect",
  description: "Full-stack AI-powered brand identity system",
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="http://localhost:3001" />
      </head>
      <body className="min-h-screen bg-[#07081a] antialiased text-white">
        {children}
      </body>
    </html>
  );
}
