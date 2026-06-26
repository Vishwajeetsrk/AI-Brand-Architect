import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXORA - AI Brand Architect",
  description: "Full-stack AI-powered brand identity system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#07081a] antialiased">{children}</body>
    </html>
  );
}
