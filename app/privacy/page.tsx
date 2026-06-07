export default function PrivacyPage() {
    return (
      <main className="min-h-screen bg-white text-black">
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
  
          <p className="mt-4 text-gray-600">
            Questa pagina descrive in modo generale come EdilRate tratta i dati
            personali degli utenti.
          </p>
  
          <div className="mt-10 space-y-8 text-gray-700 leading-7">
            <section>
              <h2 className="text-2xl font-semibold text-black">Dati raccolti</h2>
              <p className="mt-3">
                EdilRate può raccogliere dati come nome, email, informazioni di
                login, recensioni pubblicate, richieste di preventivo e feedback
                inviati tramite il sito.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Finalità</h2>
              <p className="mt-3">
                I dati vengono utilizzati per permettere l’uso della piattaforma,
                gestire recensioni, richieste di preventivo, profili aziendali,
                feedback e comunicazioni relative al servizio.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Accesso con Google</h2>
              <p className="mt-3">
                Il login può avvenire tramite provider esterni come Google.
                EdilRate utilizza solo le informazioni necessarie per identificare
                l’utente e consentire l’accesso.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Conservazione</h2>
              <p className="mt-3">
                I dati sono conservati per il tempo necessario all’erogazione del
                servizio o fino a richiesta di cancellazione, salvo obblighi di
                legge.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold text-black">Diritti degli utenti</h2>
              <p className="mt-3">
                Gli utenti possono richiedere accesso, modifica o cancellazione
                dei propri dati scrivendo ai contatti indicati sul sito.
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