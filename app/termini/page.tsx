import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Termini e condizioni",
  description:
    "Consulta i termini e le condizioni di utilizzo della piattaforma EdilRate.",
  alternates: {
    canonical: "/termini",
  },
};

export default function TerminiPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold">Termini e condizioni</h1>

        <p className="mt-6 text-gray-600">
          Ultimo aggiornamento: 29 agosto 2026
        </p>

        <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-black">
              1. Ambito di applicazione
            </h2>

            <p className="mt-4">
              I presenti Termini e condizioni disciplinano l&apos;accesso e
              l&apos;utilizzo di EdilRate, piattaforma online disponibile
              tramite edilrate.it e dedicata alla ricerca, valutazione e
              contatto di imprese e professionisti del settore delle
              costruzioni.
            </p>

            <p className="mt-4">
              Utilizzando la piattaforma, l&apos;utente si impegna a rispettare
              i presenti Termini e la normativa applicabile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              2. Servizi offerti
            </h2>

            <p className="mt-4">
              EdilRate consente, a seconda delle funzionalità disponibili, di:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>cercare e consultare profili di imprese;</li>
              <li>leggere valutazioni e recensioni pubblicate dagli utenti;</li>
              <li>pubblicare recensioni e valutazioni;</li>
              <li>inviare richieste di preventivo alle imprese;</li>
              <li>richiedere la rivendicazione di un profilo aziendale;</li>
              <li>gestire le informazioni del proprio profilo aziendale;</li>
              <li>
                utilizzare funzionalità aggiuntive eventualmente riservate agli
                abbonati EdilRate PRO;
              </li>
              <li>inviare feedback e comunicazioni relative al servizio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              3. Account utente
            </h2>

            <p className="mt-4">
              Alcune funzionalità richiedono la creazione o l&apos;utilizzo di
              un account EdilRate. L&apos;accesso può avvenire tramite le
              modalità disponibili sulla piattaforma, inclusi email e password
              e provider esterni come Google o Facebook.
            </p>

            <p className="mt-4">
              L&apos;utente è responsabile della correttezza delle informazioni
              fornite, della sicurezza delle proprie credenziali e delle
              attività effettuate tramite il proprio account.
            </p>

            <p className="mt-4">
              In caso di accesso non autorizzato o sospetta compromissione
              dell&apos;account, l&apos;utente è invitato a contattare
              tempestivamente EdilRate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              4. Recensioni
            </h2>

            <p className="mt-4">
              Le recensioni devono riferirsi a esperienze reali e devono essere
              pubblicate in buona fede.
            </p>

            <p className="mt-4">
              Non è consentito pubblicare contenuti falsi, ingannevoli,
              diffamatori, minacciosi, discriminatori, offensivi, illeciti,
              promozionali, spam oppure contenuti che violino diritti di terzi.
            </p>

            <p className="mt-4">
              Non è inoltre consentito utilizzare le recensioni per alterare
              artificialmente la reputazione di un&apos;impresa, ad esempio
              attraverso recensioni non autentiche, coordinate o pubblicate in
              presenza di conflitti di interesse non dichiarati.
            </p>

            <p className="mt-4">
              L&apos;autore rimane responsabile del contenuto della propria
              recensione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              5. Risposte delle imprese alle recensioni
            </h2>

            <p className="mt-4">
              Quando la funzionalità è disponibile, le imprese possono
              pubblicare una risposta alle recensioni ricevute.
            </p>

            <p className="mt-4">
              Le risposte devono rispettare gli stessi principi di correttezza,
              liceità e rispetto applicabili agli altri contenuti della
              piattaforma e non devono contenere dati personali non necessari,
              minacce, contenuti offensivi o informazioni illecite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              6. Profili aziendali
            </h2>

            <p className="mt-4">
              EdilRate può rendere disponibili profili relativi a imprese e
              professionisti utilizzando informazioni fornite dagli
              interessati, informazioni pubblicamente disponibili o altre fonti
              legittimamente utilizzabili.
            </p>

            <p className="mt-4">
              La presenza di un profilo su EdilRate non implica necessariamente
              che l&apos;impresa abbia creato, rivendicato o approvato il
              profilo.
            </p>

            <p className="mt-4">
              Le imprese possono richiedere la rivendicazione del proprio
              profilo. EdilRate può effettuare verifiche prima di approvare una
              richiesta e può rifiutarla quando non sia possibile accertarne
              sufficientemente la legittimità.
            </p>

            <p className="mt-4">
              L&apos;impresa che gestisce un profilo è responsabile della
              correttezza e dell&apos;aggiornamento delle informazioni che
              inserisce o modifica.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              7. Richieste di preventivo
            </h2>

            <p className="mt-4">
              EdilRate facilita il contatto tra utenti e imprese attraverso
              l&apos;invio di richieste di preventivo.
            </p>

            <p className="mt-4">
              EdilRate non è parte del successivo rapporto contrattuale tra
              utente e impresa. Preventivi, sopralluoghi, incarichi, contratti,
              lavori, pagamenti, garanzie e ogni altra condizione relativa alla
              prestazione vengono concordati direttamente tra le parti.
            </p>

            <p className="mt-4">
              EdilRate non garantisce che un&apos;impresa risponda a una
              richiesta di preventivo né che venga raggiunto un accordo tra le
              parti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              8. EdilRate PRO
            </h2>

            <p className="mt-4">
              EdilRate può offrire alle imprese un servizio in abbonamento
              denominato EdilRate PRO, che consente di accedere a funzionalità
              aggiuntive rispetto al servizio gratuito.
            </p>

            <p className="mt-4">
              Le funzionalità incluse, i prezzi e la periodicità dei piani
              disponibili sono indicati nella pagina dedicata a EdilRate PRO e
              nel processo di acquisto.
            </p>

            <p className="mt-4">
              Salvo diversa indicazione, l&apos;abbonamento è ricorrente e si
              rinnova automaticamente secondo la periodicità del piano scelto
              fino alla sua cancellazione.
            </p>

            <p className="mt-4">
              EdilRate può aggiornare nel tempo le caratteristiche o il prezzo
              dei piani PRO. Eventuali modifiche applicabili agli abbonamenti
              già in corso saranno comunicate quando richiesto e nel rispetto
              della normativa applicabile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              9. Pagamenti
            </h2>

            <p className="mt-4">
              I pagamenti relativi a EdilRate PRO vengono elaborati tramite
              Stripe.
            </p>

            <p className="mt-4">
              Prima di confermare l&apos;acquisto, il cliente può visualizzare
              il prezzo applicabile, la periodicità dell&apos;abbonamento e le
              informazioni relative al pagamento.
            </p>

            <p className="mt-4">
              L&apos;utente è responsabile di fornire un metodo di pagamento
              valido e informazioni corrette necessarie alla gestione
              dell&apos;abbonamento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              10. Rinnovo e cancellazione di EdilRate PRO
            </h2>

            <p className="mt-4">
              Gli abbonamenti EdilRate PRO si rinnovano automaticamente alla
              scadenza del periodo previsto dal piano selezionato, salvo
              cancellazione effettuata prima del successivo rinnovo.
            </p>

            <p className="mt-4">
              L&apos;abbonamento può essere gestito e cancellato tramite le
              funzionalità messe a disposizione nella dashboard e nel portale
              di gestione dell&apos;abbonamento.
            </p>

            <p className="mt-4">
              Salvo diversa indicazione, la cancellazione ha effetto al termine
              del periodo di abbonamento già pagato. Fino a tale data,
              l&apos;impresa può continuare a utilizzare le funzionalità PRO.
            </p>

            <p className="mt-4">
              La cancellazione interrompe i successivi rinnovi automatici e non
              comporta automaticamente il rimborso del periodo già pagato,
              fatti salvi eventuali diritti inderogabili previsti dalla legge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              11. Moderazione e segnalazioni
            </h2>

            <p className="mt-4">
              EdilRate può effettuare attività di moderazione e può limitare,
              sospendere o rimuovere contenuti che risultino contrari ai
              presenti Termini, alla normativa applicabile o alla sicurezza
              della piattaforma.
            </p>

            <p className="mt-4">
              Utenti e imprese possono contattare EdilRate per segnalare
              contenuti ritenuti illeciti, falsi, abusivi o comunque non
              conformi.
            </p>

            <p className="mt-4">
              EdilRate può richiedere informazioni aggiuntive necessarie a
              valutare una segnalazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              12. Sospensione o limitazione degli account
            </h2>

            <p className="mt-4">
              EdilRate può limitare o sospendere l&apos;accesso a determinate
              funzionalità o agli account in caso di violazione dei presenti
              Termini, attività fraudolente, abusi, rischi per la sicurezza,
              utilizzo illecito della piattaforma o altri comportamenti che
              possano arrecare danno agli utenti, alle imprese o a EdilRate.
            </p>

            <p className="mt-4">
              Quando appropriato e compatibile con le esigenze di sicurezza o
              con gli obblighi di legge, EdilRate potrà fornire informazioni
              relative alla misura adottata.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              13. Responsabilità delle imprese
            </h2>

            <p className="mt-4">
              Le imprese presenti sulla piattaforma operano in modo autonomo e
              sono responsabili dei servizi che offrono, delle informazioni che
              forniscono, dei preventivi emessi e dei rapporti instaurati con i
              propri clienti.
            </p>

            <p className="mt-4">
              La presenza, la rivendicazione del profilo, il badge PRO o altre
              funzionalità della piattaforma non costituiscono una garanzia,
              certificazione o approvazione da parte di EdilRate della qualità
              dei lavori o dell&apos;affidabilità dell&apos;impresa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              14. Limiti del servizio
            </h2>

            <p className="mt-4">
              EdilRate si impegna a mantenere la piattaforma funzionante e
              aggiornata, ma non garantisce che il servizio sia disponibile
              senza interruzioni, errori o malfunzionamenti.
            </p>

            <p className="mt-4">
              Nei limiti consentiti dalla legge, EdilRate non garantisce la
              qualità, disponibilità, correttezza, affidabilità o idoneità dei
              servizi offerti dalle imprese presenti sulla piattaforma.
            </p>

            <p className="mt-4">
              Gli utenti sono invitati a effettuare autonomamente le verifiche
              ritenute opportune prima di affidare lavori o incarichi a
              un&apos;impresa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              15. Proprietà intellettuale
            </h2>

            <p className="mt-4">
              Il marchio, la denominazione, la grafica, il design, il software
              e gli altri elementi originali della piattaforma EdilRate sono
              protetti dalla normativa applicabile e non possono essere
              utilizzati o riprodotti senza autorizzazione, salvo quanto
              consentito dalla legge.
            </p>

            <p className="mt-4">
              Gli utenti mantengono i diritti sui contenuti originali da loro
              pubblicati e concedono a EdilRate, nei limiti necessari al
              funzionamento della piattaforma, il diritto di ospitarli,
              visualizzarli e renderli disponibili attraverso il servizio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              16. Modifiche alla piattaforma
            </h2>

            <p className="mt-4">
              EdilRate può aggiornare, modificare, aggiungere o rimuovere
              funzionalità della piattaforma per esigenze tecniche, operative,
              di sicurezza o di evoluzione del servizio.
            </p>

            <p className="mt-4">
              Le modifiche che incidano in modo rilevante sui servizi a
              pagamento saranno gestite nel rispetto degli obblighi previsti
              dalla normativa applicabile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              17. Modifiche ai Termini
            </h2>

            <p className="mt-4">
              I presenti Termini possono essere aggiornati periodicamente per
              riflettere modifiche del servizio, esigenze operative o
              cambiamenti normativi.
            </p>

            <p className="mt-4">
              La versione aggiornata sarà pubblicata su questa pagina con
              indicazione della data dell&apos;ultimo aggiornamento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              18. Legge applicabile
            </h2>

            <p className="mt-4">
              I presenti Termini sono regolati dalla legge italiana, fatti
              salvi gli eventuali diritti inderogabili riconosciuti agli utenti
              dalla normativa applicabile.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black">
              19. Contatti
            </h2>

            <p className="mt-4">
              Per informazioni, assistenza o segnalazioni relative ai presenti
              Termini è possibile contattare EdilRate all&apos;indirizzo{" "}
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