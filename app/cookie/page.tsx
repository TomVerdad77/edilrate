import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Informazioni sull'utilizzo dei cookie da parte di EdilRate.",
};

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function CookiePage() {
    return (
      <main className="min-h-screen bg-white text-black">
        <Navbar />
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h1 className="text-5xl font-bold">Cookie Policy</h1>
  
          <p className="mt-6 text-gray-600">
            Ultimo aggiornamento: giugno 2026
          </p>
  
          <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-black">
                Cosa sono i cookie
              </h2>
  
              <p className="mt-4">
                I cookie sono piccoli file di testo memorizzati sul dispositivo
                dell'utente durante la navigazione.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">
                Cookie tecnici
              </h2>
  
              <p className="mt-4">
                EdilRate utilizza cookie tecnici necessari al funzionamento della
                piattaforma, all'autenticazione degli utenti e alla gestione delle
                sessioni.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">
                Cookie di terze parti
              </h2>
  
              <p className="mt-4">
                Alcuni servizi esterni come Google e Facebook possono utilizzare
                cookie propri per consentire l'accesso e la gestione
                dell'autenticazione.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">
                Gestione dei cookie
              </h2>
  
              <p className="mt-4">
                L'utente può limitare o disabilitare i cookie tramite le
                impostazioni del proprio browser.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">
                Modifiche alla policy
              </h2>
  
              <p className="mt-4">
                Questa Cookie Policy può essere aggiornata nel tempo per riflettere
                eventuali modifiche tecniche o normative.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">
                Nota importante
              </h2>
  
              <p className="mt-4">
                Questa è una versione iniziale della Cookie Policy e dovrà essere
                revisionata prima del lancio pubblico definitivo.
              </p>
            </section>
          </div>
        </section>
        <Footer />
      </main>
    );
  }