import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "EdilRate - Recensioni e preventivi per imprese edili",
  description:
    "Trova imprese edili in Friuli Venezia Giulia, leggi recensioni reali e richiedi preventivi direttamente alle aziende.",
   
    icons: {
      icon: "/favicon.ico?v=3",
      shortcut: "/favicon.ico?v=3",
      apple: "/favicon.ico?v=3",
    },

  openGraph: {
    title: "EdilRate",
    description:
      "La piattaforma di recensioni per imprese edili del Friuli Venezia Giulia.",
    url: "https://edilrate.vercel.app",
    siteName: "EdilRate",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
