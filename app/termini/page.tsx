export default function TerminiPage() {
    return (
      <main className="min-h-screen bg-white text-black">
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold">Termini di servizio</h1>
  
          <p className="mt-4 text-gray-600">
            Questi termini regolano l’utilizzo della piattaforma EdilRate.
          </p>
  
          <div className="mt-10 space-y-8 text-gray-700 leading-7">
            <section>
              <h2 className="text-2xl font-semibold text-black">Uso della piattaforma</h2>
              <p className="mt-3">
                EdilRate consente agli utenti di cercare imprese edili, leggere
                recensioni, inviare richieste di preventivo e pubblicare feedback.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Recensioni</h2>
              <p className="mt-3">
                Gli utenti sono responsabili dei contenuti pubblicati. Non sono
                consentite recensioni false, offensive, diffamatorie o non basate
                su esperienze reali.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Profili aziendali</h2>
              <p className="mt-3">
                Le imprese possono richiedere la gestione del proprio profilo.
                EdilRate può verificare, approvare, modificare o rimuovere profili
                e contenuti non conformi.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Richieste di preventivo</h2>
              <p className="mt-3">
                EdilRate facilita il contatto tra utenti e imprese, ma non è parte
                del rapporto contrattuale tra cliente e azienda.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Limitazione di responsabilità</h2>
              <p className="mt-3">
                EdilRate non garantisce la qualità, disponibilità o correttezza dei
                servizi offerti dalle imprese presenti sulla piattaforma.
              </p>
            </section>
  
            <p className="text-sm text-gray-500">
              Nota: questa è una bozza iniziale e dovrà essere revisionata prima
              del lancio pubblico.
            </p>
          </div>
        </section>
      </main>
    );
  }