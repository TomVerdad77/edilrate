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

  applicationName: "EdilRate",

  title: {
    default: "EdilRate | Recensioni e preventivi per imprese edili",
    template: "%s | EdilRate",
  },

  description:
    "Trova imprese edili, consulta recensioni reali, confronta aziende e richiedi preventivi in Friuli Venezia Giulia.",

  keywords: [
    "imprese edili",
    "recensioni imprese edili",
    "aziende edili",
    "preventivi edilizia",
    "ristrutturazioni",
    "imprese edili Friuli Venezia Giulia",
    "imprese edili Trieste",
    "EdilRate",
  ],

  authors: [
    {
      name: "EdilRate",
    },
  ],

  creator: "EdilRate",
  publisher: "EdilRate",

  category: "Edilizia",

  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName: "EdilRate",
    title: "EdilRate | Trova l’impresa edile giusta",
    description:
      "Consulta recensioni reali, confronta imprese edili e richiedi preventivi attraverso EdilRate.",
    images: [
      {
        url: "/logo-edilrate.png",
        alt: "EdilRate",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "EdilRate | Trova l’impresa edile giusta",
    description:
      "Consulta recensioni reali, confronta imprese edili e richiedi preventivi attraverso EdilRate.",
    images: ["/logo-edilrate.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

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
