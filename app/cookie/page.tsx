import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Informazioni sull'utilizzo di cookie e tecnologie simili da parte di EdilRate.",
  alternates: {
    canonical: "/cookie",
  },
};

export default function CookiePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold">Cookie Policy</h1>

        <p className="mt-6 text-gray-600">
          Ultimo aggiornamento: 29 agosto 2026
        </p>

        <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black">
              1. Cosa sono i cookie
            </h2>

            <p className="mt-4">
              I cookie sono piccoli file di testo che possono essere
              memorizzati sul dispositivo dell&apos;utente durante la
              navigazione su un sito web.
            </p>

            <p className="mt-4">
              Tecnologie analoghe, come sistemi di archiviazione locale,
              possono essere utilizzate per consentire determinate
              funzionalità tecniche della piattaforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              2. Tecnologie necessarie al funzionamento di EdilRate
            </h2>

            <p className="mt-4">
              EdilRate utilizza cookie o tecnologie tecniche necessarie al
              funzionamento della piattaforma, alla sicurezza, alla gestione
              delle sessioni e all&apos;autenticazione degli utenti.
            </p>

            <p className="mt-4">
              Queste tecnologie permettono, ad esempio, di mantenere attiva una
              sessione autenticata, riconoscere correttamente l&apos;utente e
              consentire l&apos;accesso alle aree riservate della piattaforma.
            </p>

            <p className="mt-4">
              Tali strumenti sono utilizzati nella misura necessaria a fornire
              il servizio richiesto dall&apos;utente e a garantirne il corretto
              funzionamento e la sicurezza.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              3. Autenticazione
            </h2>

            <p className="mt-4">
              EdilRate utilizza Supabase per la gestione
              dell&apos;autenticazione e delle sessioni degli utenti.
            </p>

            <p className="mt-4">
              Gli utenti possono inoltre scegliere di accedere tramite provider
              esterni, come Google o Facebook. Durante il processo di
              autenticazione, tali servizi possono utilizzare propri cookie o
              tecnologie necessarie a completare l&apos;accesso secondo le
              rispettive modalità di funzionamento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              4. Pagamenti e Stripe
            </h2>

            <p className="mt-4">
              Per l&apos;acquisto e la gestione degli abbonamenti EdilRate PRO,
              l&apos;utente può essere indirizzato verso servizi forniti da
              Stripe.
            </p>

            <p className="mt-4">
              Stripe può utilizzare cookie o tecnologie analoghe necessarie
              alla sicurezza, alla prevenzione delle frodi, all&apos;esecuzione
              dei pagamenti e alla gestione dell&apos;abbonamento secondo le
              proprie condizioni e informative.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              5. Cookie di profilazione e marketing
            </h2>

            <p className="mt-4">
              Al momento EdilRate non utilizza direttamente cookie di
              profilazione o marketing per creare profili pubblicitari degli
              utenti durante la normale navigazione sulla piattaforma.
            </p>

            <p className="mt-4">
              Qualora in futuro vengano introdotti strumenti di analisi,
              profilazione, advertising o altre tecnologie non strettamente
              necessarie che richiedano il consenso dell&apos;utente, EdilRate
              aggiornerà la presente Cookie Policy e adotterà, ove necessario,
              strumenti per la raccolta e la gestione preventiva del consenso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              6. Servizi di terze parti
            </h2>

            <p className="mt-4">
              Alcune funzionalità di EdilRate dipendono da servizi forniti da
              soggetti terzi. L&apos;utilizzo di tali servizi può comportare
              l&apos;applicazione delle rispettive informative privacy e cookie.
            </p>

            <p className="mt-4">
              Tra i principali fornitori utilizzati dalla piattaforma possono
              rientrare Supabase, Stripe, Google e Meta/Facebook.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              7. Gestione tramite il browser
            </h2>

            <p className="mt-4">
              L&apos;utente può visualizzare, eliminare o limitare cookie e
              altri dati memorizzati attraverso le impostazioni del proprio
              browser.
            </p>

            <p className="mt-4">
              La disabilitazione di tecnologie strettamente necessarie può
              tuttavia impedire il corretto funzionamento di alcune
              funzionalità, come l&apos;accesso all&apos;account o alle aree
              riservate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              8. Privacy Policy
            </h2>

            <p className="mt-4">
              Per ulteriori informazioni sul trattamento dei dati personali
              effettuato attraverso EdilRate è possibile consultare la Privacy
              Policy disponibile sulla piattaforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              9. Modifiche alla Cookie Policy
            </h2>

            <p className="mt-4">
              EdilRate può aggiornare la presente Cookie Policy in seguito a
              modifiche tecniche della piattaforma, introduzione di nuovi
              servizi o cambiamenti della normativa applicabile.
            </p>

            <p className="mt-4">
              La versione aggiornata sarà pubblicata su questa pagina con
              indicazione della data dell&apos;ultimo aggiornamento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              10. Contatti
            </h2>

            <p className="mt-4">
              Per richieste relative alla presente Cookie Policy è possibile
              contattare EdilRate all&apos;indirizzo{" "}
              <a
                href="mailto:info@edilrate.it"
                className="font-medium text-black underline underline-offset-4"
              >
                info@edilrate.it
              </a>
              .
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}