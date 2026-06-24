import Footer from "@/components/Footer";
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold">Privacy Policy</h1>

        <p className="mt-6 text-gray-600">
          Ultimo aggiornamento: giugno 2026
        </p>

        <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black">
              1. Introduzione
            </h2>
            <p className="mt-4">
              EdilRate è una piattaforma online dedicata alla ricerca,
              recensione e contatto di imprese edili e professionisti del
              settore in Friuli Venezia Giulia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              2. Dati raccolti
            </h2>
            <p className="mt-4">
              Possiamo raccogliere dati come nome, email, informazioni di
              accesso tramite Google o Facebook, recensioni pubblicate,
              richieste di preventivo, feedback inviati e dati relativi ai
              profili aziendali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              3. Finalità del trattamento
            </h2>
            <p className="mt-4">
              I dati vengono utilizzati per consentire l’utilizzo della
              piattaforma, gestire account utenti, recensioni, richieste di
              preventivo, rivendicazioni aziendali, feedback e comunicazioni
              relative al servizio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              4. Login tramite provider esterni
            </h2>
            <p className="mt-4">
              L’accesso può avvenire tramite provider esterni come Google e
              Facebook. EdilRate utilizza solo le informazioni necessarie
              all’identificazione dell’utente e alla gestione dell’account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              5. Recensioni e contenuti pubblicati
            </h2>
            <p className="mt-4">
              Le recensioni pubblicate dagli utenti possono essere visibili
              pubblicamente sulla piattaforma. Gli utenti sono responsabili dei
              contenuti inseriti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              6. Richieste di preventivo
            </h2>
            <p className="mt-4">
              Quando un utente invia una richiesta di preventivo, i dati
              inseriti possono essere condivisi con l’impresa destinataria per
              permettere il contatto e la gestione della richiesta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              7. Conservazione dei dati
            </h2>
            <p className="mt-4">
              I dati vengono conservati per il tempo necessario all’erogazione
              del servizio o fino a richiesta di cancellazione, salvo obblighi
              di legge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              8. Diritti dell’utente
            </h2>
            <p className="mt-4">
              Gli utenti possono richiedere accesso, modifica o cancellazione
              dei propri dati personali scrivendo tramite la pagina Contatti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              9. Nota importante
            </h2>
            <p className="mt-4">
              Questa Privacy Policy è una bozza iniziale e dovrà essere
              revisionata prima del lancio pubblico definitivo della piattaforma.
            </p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}