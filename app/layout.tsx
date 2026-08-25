import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bedaya Travel & Biology",
  description: "رحلات سياحية وكورسات أحياء",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}