import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprese edili",
  description:
    "Consulta l’elenco delle imprese edili presenti su EdilRate. Cerca aziende per città, categoria e provincia e confronta recensioni e richieste di preventivo.",
  alternates: {
    canonical: "/imprese",
  },
  openGraph: {
    title: "Trova imprese edili | EdilRate",
    description:
      "Cerca e confronta imprese edili per città, provincia e categoria.",
    url: "/imprese",
  },
};

export default function CompaniesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}