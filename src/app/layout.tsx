import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/layout/PublicShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Oğuzhan Kapukaya | Araştırma Görevlisi",
    template: "%s | Oğuzhan Kapukaya",
  },
  description:
    "İstanbul Teknik Üniversitesi Elektrik ve Elektronik Mühendisliği bölümünde araştırma görevlisi. Güç elektroniği, gömülü sistemler ve sinyal işleme alanlarında araştırmalar.",
  keywords: [
    "Oğuzhan Kapukaya",
    "araştırma görevlisi",
    "elektrik elektronik mühendisliği",
    "İTÜ",
    "güç elektroniği",
    "gömülü sistemler",
    "FPGA",
    "mikrodenetleyici",
  ],
  authors: [{ name: "Oğuzhan Kapukaya" }],
  creator: "Oğuzhan Kapukaya",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Oğuzhan Kapukaya",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
