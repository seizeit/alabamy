import type { Metadata } from "next";
import { Inter, Outfit, Lora } from "next/font/google";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alabamy | Alabama News",
  description:
    "Alabama's news, all in one place. Headlines from 44 sources across the state, updated daily.",
  openGraph: {
    title: "Alabamy | Alabama News",
    description:
      "Alabama's news, all in one place. Headlines from 44 sources across the state, updated daily.",
    url: "https://alabamy.com",
    siteName: "Alabamy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alabamy | Alabama News",
    description:
      "Alabama's news, all in one place. Headlines from 44 sources across the state, updated daily.",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${lora.variable}`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
