import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
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
      <body className={`${inter.variable} ${raleway.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
