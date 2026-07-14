import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Aiutaci a migliorare EdilRate inviando suggerimenti, segnalazioni o nuove idee.",
  alternates: {
    canonical: "/feedback",
  },
  openGraph: {
    title: "Invia un feedback | EdilRate",
    description:
      "Condividi suggerimenti e segnalazioni per aiutarci a migliorare EdilRate.",
    url: "/feedback",
  },
};

export default function FeedbackLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}