import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alabamy",
  description: "Alabama News Aggregator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
