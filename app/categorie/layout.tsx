import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorie di imprese",
  description:
    "Esplora le categorie di imprese edili presenti su EdilRate e trova rapidamente l’azienda più adatta al tuo progetto.",
  alternates: {
    canonical: "/categorie",
  },
  openGraph: {
    title: "Categorie di imprese edili | EdilRate",
    description:
      "Esplora le attività disponibili e trova imprese edili per categoria.",
    url: "/categorie",
  },
};

export default function CategoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}