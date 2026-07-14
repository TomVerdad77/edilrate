import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termini e condizioni",
  description:
    "Consulta i termini e le condizioni di utilizzo della piattaforma EdilRate.",
};

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TerminiPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold">Termini di servizio</h1>

        <p className="mt-6 text-gray-600">
          Ultimo aggiornamento: giugno 2026
        </p>

        <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black">
              1. Uso della piattaforma
            </h2>
            <p className="mt-4">
              EdilRate consente agli utenti di cercare imprese edili, consultare
              profili aziendali, leggere e pubblicare recensioni, inviare
              richieste di preventivo e fornire feedback sul servizio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              2. Account utente
            </h2>
            <p className="mt-4">
              Gli utenti possono accedere tramite provider esterni come Google
              o Facebook. L’utente è responsabile dell’uso del proprio account
              e delle attività svolte tramite esso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              3. Recensioni
            </h2>
            <p className="mt-4">
              Le recensioni devono essere basate su esperienze reali, espresse
              in modo corretto e non offensivo. Non sono consentiti contenuti
              falsi, diffamatori, discriminatori, promozionali o contrari alla
              legge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              4. Profili aziendali
            </h2>
            <p className="mt-4">
              Le aziende possono richiedere la rivendicazione del proprio
              profilo. EdilRate si riserva la possibilità di approvare,
              rifiutare, modificare o rimuovere profili e contenuti non
              conformi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              5. Richieste di preventivo
            </h2>
            <p className="mt-4">
              EdilRate facilita il contatto tra utenti e imprese, ma non è parte
              del rapporto contrattuale tra cliente e azienda. Eventuali accordi,
              preventivi, lavori o pagamenti avvengono direttamente tra le parti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              6. Responsabilità
            </h2>
            <p className="mt-4">
              EdilRate non garantisce la qualità, disponibilità, correttezza o
              affidabilità dei servizi offerti dalle imprese presenti sulla
              piattaforma. L’utente è invitato a valutare autonomamente ogni
              impresa prima di affidare un incarico.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              7. Contenuti e moderazione
            </h2>
            <p className="mt-4">
              EdilRate può moderare, modificare o rimuovere contenuti che
              risultino non conformi ai presenti termini, offensivi, falsi,
              spam o contrari alla legge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              8. Modifiche al servizio
            </h2>
            <p className="mt-4">
              EdilRate può modificare, sospendere o aggiornare funzionalità,
              contenuti e condizioni di utilizzo della piattaforma nel tempo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              9. Nota importante
            </h2>
            <p className="mt-4">
              Questi Termini di servizio sono una bozza iniziale e dovranno
              essere revisionati prima del lancio pubblico definitivo della
              piattaforma.
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}