"use client";

import Button from "@/components/ui/Button";
import Navbar from "@/components/Navbar";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
     <Navbar />
      <section className="max-w-2xl text-center">

        <div className="text-7xl">
          🏗️
        </div>

        <h1 className="mt-8 text-4xl md:text-6xl font-bold">
          Qualcosa è andato storto
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Si è verificato un errore imprevisto.
          Riprova oppure torna alla Home.
        </p>

        <div className="mt-10 flex justify-center gap-4">

          <Button
            onClick={() => reset()}
          >
            Riprova
          </Button>

          <Button
            href="/"
            variant="secondary"
          >
            Torna alla Home
          </Button>

        </div>

      </section>
    </main>
  );
}