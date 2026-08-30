import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali degli utenti di EdilRate.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold">Privacy Policy</h1>

        <p className="mt-6 text-gray-600">
          Ultimo aggiornamento: 29 agosto 2026
        </p>

        <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black">
              1. Introduzione
            </h2>

            <p className="mt-4">
              La presente informativa descrive le modalità con cui EdilRate
              raccoglie, utilizza, conserva e protegge i dati personali degli
              utenti che utilizzano il sito edilrate.it e i relativi servizi.
            </p>

            <p className="mt-4">
              EdilRate è una piattaforma dedicata alla ricerca, valutazione e
              contatto di imprese e professionisti del settore delle
              costruzioni. La piattaforma consente, tra le altre funzionalità,
              di consultare profili aziendali, pubblicare recensioni,
              richiedere preventivi e, per le imprese, rivendicare e gestire il
              proprio profilo e accedere a funzionalità aggiuntive tramite
              EdilRate PRO.
            </p>
          </section>

          <section>
  <h2 className="text-2xl font-semibold text-black">
    2. Titolare del trattamento
  </h2>

  <p className="mt-4">
    EdilRate è attualmente gestito da una persona fisica, che agisce in
    qualità di titolare del trattamento dei dati personali effettuato
    attraverso la piattaforma.
  </p>

  <p className="mt-4">
    Per qualsiasi richiesta relativa al trattamento dei dati personali,
    all&apos;esercizio dei diritti previsti dalla normativa applicabile o
    per ottenere ulteriori informazioni sull&apos;identità e sui dati di
    contatto del titolare, è possibile scrivere a:
  </p>

  <p className="mt-4">
    <strong className="text-black">Email:</strong>{" "}
    <a
      href="mailto:info@edilrate.it"
      className="font-medium text-black underline underline-offset-4"
    >
      info@edilrate.it
    </a>
  </p>
</section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              3. Dati personali trattati
            </h2>

            <p className="mt-4">
              A seconda delle modalità di utilizzo della piattaforma, EdilRate
              può trattare le seguenti categorie di dati:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                dati identificativi e di contatto, come nome e indirizzo email;
              </li>
              <li>
                dati necessari alla registrazione e alla gestione
                dell&apos;account;
              </li>
              <li>
                informazioni ricevute dai provider di autenticazione esterni
                utilizzati dall&apos;utente;
              </li>
              <li>
                recensioni, valutazioni e altri contenuti inviati dagli utenti;
              </li>
              <li>
                dati inseriti nelle richieste di preventivo, come nome, email,
                numero di telefono e contenuto della richiesta;
              </li>
              <li>
                informazioni inviate tramite moduli di contatto o feedback;
              </li>
              <li>
                dati relativi alle richieste di rivendicazione dei profili
                aziendali;
              </li>
              <li>
                informazioni relative ai profili delle imprese e alla loro
                gestione;
              </li>
              <li>
                informazioni tecniche e di sicurezza necessarie al
                funzionamento e alla protezione della piattaforma;
              </li>
              <li>
                informazioni relative allo stato degli abbonamenti EdilRate
                PRO.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              4. Finalità e basi giuridiche del trattamento
            </h2>

            <p className="mt-4">
              I dati personali possono essere trattati per le seguenti
              finalità:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                creare, autenticare e gestire gli account degli utenti;
              </li>
              <li>
                consentire la pubblicazione e la gestione delle recensioni;
              </li>
              <li>
                permettere l&apos;invio e la gestione delle richieste di
                preventivo;
              </li>
              <li>
                gestire la rivendicazione e l&apos;amministrazione dei profili
                aziendali;
              </li>
              <li>
                fornire e gestire gli abbonamenti e le funzionalità EdilRate
                PRO;
              </li>
              <li>
                rispondere a richieste di assistenza, contatto o feedback;
              </li>
              <li>
                prevenire abusi, frodi e utilizzi illeciti della piattaforma;
              </li>
              <li>
                garantire sicurezza, manutenzione e corretto funzionamento del
                servizio;
              </li>
              <li>
                adempiere a eventuali obblighi previsti dalla legge.
              </li>
            </ul>

            <p className="mt-4">
              Il trattamento viene effettuato, a seconda dei casi, perché
              necessario all&apos;esecuzione di un contratto o di misure
              precontrattuali richieste dall&apos;utente, per adempiere a
              obblighi di legge, sulla base del legittimo interesse del
              titolare alla gestione e alla sicurezza della piattaforma oppure,
              quando richiesto, sulla base del consenso dell&apos;interessato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              5. Registrazione e autenticazione
            </h2>

            <p className="mt-4">
              Gli utenti possono registrarsi e accedere a EdilRate utilizzando
              le modalità di autenticazione disponibili sulla piattaforma,
              compreso l&apos;accesso tramite email e password o provider
              esterni come Google e Facebook.
            </p>

            <p className="mt-4">
              Quando viene utilizzato un provider esterno, EdilRate riceve le
              informazioni necessarie per identificare l&apos;utente e gestire
              il relativo account, secondo le autorizzazioni concesse
              dall&apos;utente e le condizioni applicate dal provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              6. Recensioni e contenuti pubblici
            </h2>

            <p className="mt-4">
              Le recensioni e le valutazioni pubblicate dagli utenti sono
              destinate a essere visualizzate pubblicamente sulle pagine delle
              imprese interessate.
            </p>

            <p className="mt-4">
              Alcune informazioni associate alla recensione, come il nome
              visualizzato dell&apos;autore, possono essere rese pubbliche
              insieme al contenuto della recensione.
            </p>

            <p className="mt-4">
              Gli utenti sono responsabili dei contenuti che pubblicano e sono
              invitati a non inserire nelle recensioni dati personali propri o
              di terzi non necessari alla valutazione dell&apos;impresa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              7. Richieste di preventivo
            </h2>

            <p className="mt-4">
              Quando un utente invia una richiesta di preventivo attraverso
              EdilRate, i dati forniti vengono trattati per trasmettere e
              rendere disponibile la richiesta all&apos;impresa destinataria.
            </p>

            <p className="mt-4">
              L&apos;impresa potrà quindi utilizzare i dati ricevuti per
              contattare l&apos;utente e gestire la richiesta. Una volta
              ricevuti i dati, l&apos;impresa potrà effettuare autonomamente i
              trattamenti necessari alla gestione del rapporto con
              l&apos;utente secondo la normativa applicabile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              8. Profili aziendali
            </h2>

            <p className="mt-4">
              EdilRate può pubblicare informazioni relative a imprese e
              professionisti del settore utilizzando dati forniti direttamente
              dagli interessati, dati pubblicamente disponibili o altre fonti
              legittimamente utilizzabili.
            </p>

            <p className="mt-4">
              Le imprese possono richiedere la rivendicazione del proprio
              profilo per gestire le informazioni e le funzionalità messe a
              disposizione dalla piattaforma.
            </p>

            <p className="mt-4">
              Eventuali richieste di rettifica, aggiornamento o rimozione di
              informazioni possono essere inviate a EdilRate tramite i canali
              di contatto disponibili sul sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              9. EdilRate PRO e pagamenti
            </h2>

            <p className="mt-4">
              EdilRate offre alle imprese funzionalità aggiuntive tramite
              abbonamenti EdilRate PRO.
            </p>

            <p className="mt-4">
              I pagamenti vengono gestiti tramite Stripe. EdilRate non
              memorizza direttamente i dati completi delle carte di pagamento.
              Stripe tratta i dati necessari all&apos;elaborazione dei
              pagamenti e alla gestione degli abbonamenti secondo le proprie
              condizioni e informative privacy.
            </p>

            <p className="mt-4">
              EdilRate conserva le informazioni necessarie a identificare lo
              stato dell&apos;abbonamento e ad abilitare le relative
              funzionalità sulla piattaforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              10. Fornitori e destinatari dei dati
            </h2>

            <p className="mt-4">
              Per fornire il servizio, EdilRate può avvalersi di fornitori
              tecnologici che trattano dati nell&apos;ambito dei servizi
              prestati.
            </p>

            <p className="mt-4">
              Tra questi possono rientrare, in particolare:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Supabase, per database, autenticazione e archiviazione;</li>
              <li>Vercel, per hosting e distribuzione della piattaforma;</li>
              <li>Stripe, per pagamenti e gestione degli abbonamenti;</li>
              <li>
                Google e Meta/Facebook, quando utilizzati come provider di
                autenticazione.
              </li>
            </ul>

            <p className="mt-4">
              I dati possono inoltre essere comunicati alle imprese
              destinatarie delle richieste di preventivo, nonché ad autorità o
              altri soggetti quando ciò sia richiesto dalla legge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              11. Trasferimenti internazionali
            </h2>

            <p className="mt-4">
              Alcuni fornitori utilizzati da EdilRate possono trattare dati
              anche al di fuori dello Spazio Economico Europeo. In tali casi,
              il trattamento e gli eventuali trasferimenti internazionali dei
              dati avvengono nel rispetto delle garanzie previste dalla
              normativa applicabile in materia di protezione dei dati
              personali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              12. Conservazione dei dati
            </h2>

            <p className="mt-4">
              I dati personali vengono conservati per il tempo necessario a
              fornire i servizi richiesti e perseguire le finalità descritte
              nella presente informativa.
            </p>

            <p className="mt-4">
              Alcuni dati possono essere conservati più a lungo quando ciò sia
              necessario per adempiere a obblighi di legge, tutelare i diritti
              di EdilRate o degli utenti, gestire contestazioni, prevenire
              abusi o garantire la sicurezza della piattaforma.
            </p>

            <p className="mt-4">
              In caso di richiesta di cancellazione dell&apos;account, i dati
              vengono eliminati o anonimizzati quando non sussistano ulteriori
              basi giuridiche o obblighi che ne richiedano la conservazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              13. Sicurezza
            </h2>

            <p className="mt-4">
              EdilRate adotta misure tecniche e organizzative ragionevoli
              finalizzate a proteggere i dati personali da accessi non
              autorizzati, perdita, alterazione, divulgazione o utilizzo
              improprio.
            </p>

            <p className="mt-4">
              Nessun sistema informatico può tuttavia garantire una sicurezza
              assoluta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              14. Diritti degli interessati
            </h2>

            <p className="mt-4">
              Nei casi previsti dalla normativa applicabile, gli interessati
              possono esercitare i propri diritti in materia di protezione dei
              dati personali, tra cui:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>ottenere conferma dell&apos;esistenza dei propri dati;</li>
              <li>accedere ai propri dati personali;</li>
              <li>richiederne la rettifica o l&apos;aggiornamento;</li>
              <li>richiederne la cancellazione;</li>
              <li>richiedere la limitazione del trattamento;</li>
              <li>opporsi al trattamento nei casi previsti dalla legge;</li>
              <li>
                ottenere la portabilità dei dati quando applicabile;
              </li>
              <li>
                revocare il consenso, quando il trattamento è basato sul
                consenso, senza pregiudicare la liceità del trattamento
                precedente alla revoca.
              </li>
            </ul>

            <p className="mt-4">
              Le richieste possono essere inviate a{" "}
              <a
                href="mailto:info@edilrate.it"
                className="font-medium text-black underline underline-offset-4"
              >
                info@edilrate.it
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              15. Reclamo all&apos;autorità di controllo
            </h2>

            <p className="mt-4">
              Gli interessati hanno inoltre il diritto di proporre reclamo
              all&apos;autorità di controllo competente in materia di
              protezione dei dati personali. In Italia, l&apos;autorità
              competente è il Garante per la protezione dei dati personali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              16. Cookie e tecnologie simili
            </h2>

            <p className="mt-4">
              Le informazioni relative all&apos;utilizzo di cookie e
              tecnologie analoghe sono disponibili nella Cookie Policy di
              EdilRate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              17. Modifiche alla Privacy Policy
            </h2>

            <p className="mt-4">
              EdilRate può aggiornare periodicamente la presente informativa
              per riflettere modifiche della piattaforma, dei servizi offerti o
              della normativa applicabile.
            </p>

            <p className="mt-4">
              La versione aggiornata sarà pubblicata su questa pagina con
              indicazione della data dell&apos;ultimo aggiornamento.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}