import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Contatta EdilRate per informazioni, assistenza, segnalazioni o collaborazioni.",
  alternates: {
    canonical: "/contatti",
  },
};

export default function ContattiPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold">Contatti</h1>

        <p className="mt-4 text-gray-600">
          Hai domande, suggerimenti, hai bisogno di assistenza o vuoi
          segnalare un problema? Puoi contattare EdilRate tramite
          l&apos;indirizzo email indicato qui sotto.
        </p>

        <div className="mt-10 rounded-3xl border p-6">
          <h2 className="text-xl font-semibold">Contatta EdilRate</h2>

          <p className="mt-4 text-gray-700">
            Per assistenza, informazioni, segnalazioni, richieste relative
            alla privacy o collaborazioni:
          </p>

          <p className="mt-3">
            <a
              href="mailto:info@edilrate.it"
              className="font-medium text-black underline underline-offset-4"
            >
              info@edilrate.it
            </a>
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Area iniziale del servizio: Friuli Venezia Giulia.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}