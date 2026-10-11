import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://edilrate.it"),

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
      <body className="min-h-full flex flex-col">
  {children}

  {/* Umami Analytics */}
  <Script
    src="https://cloud.umami.is/script.js"
    data-website-id="f249ca3d-9eb0-441c-a274-b025d5aa161d"
    strategy="afterInteractive"
  />

  {/* Google Consent Mode v2 - consenso negato di default */}
  <Script id="google-consent-default" strategy="beforeInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}

      gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500
      });
    `}
  </Script>

  {/* Google Ads - Google tag */}
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=AW-18501465685"
    strategy="afterInteractive"
  />

  <Script id="google-ads-tag" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-18501465685');
    `}
  </Script>

  {/* Banner consenso cookie */}
  <CookieBanner />
</body>
    </html>
  );
}