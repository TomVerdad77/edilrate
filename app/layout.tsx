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
  metadataBase: new URL("https://edilrate.vercel.app"),

  title: {
    default: "EdilRate",
    template: "%s | EdilRate",
  },

  description:
    "Trova imprese edili, leggi recensioni verificate e richiedi preventivi in Friuli Venezia Giulia.",

  icons: {
    icon: "/edilrate-favicon.ico",
    shortcut: "/edilrate-favicon.ico",
    apple: "/edilrate-favicon.ico",
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
