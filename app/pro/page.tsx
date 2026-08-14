import ProCheckoutButton from "./components/ProCheckoutButton";

export const metadata = {
    title: "EdilRate PRO | Più visibilità per la tua impresa",
    description:
      "Scopri EdilRate PRO: più visibilità, gestione della reputazione, statistiche e strumenti professionali pensati per le imprese edili.",
  };
  
  const benefits = [
    {
      icon: "👀",
      title: "Fatti trovare da più clienti",
      description:
        "Dai maggiore visibilità alla tua impresa grazie al badge PRO e alla priorità nei risultati di ricerca.",
    },
    {
      icon: "⭐",
      title: "Genera fiducia attraverso il tuo lavoro",
      description:
        "Valorizza la tua reputazione rispondendo alle recensioni e mostrando ai futuri clienti la qualità dei lavori che realizzi.",
    },
    {
      icon: "📈",
      title: "Genera nuove opportunità",
      description:
        "Monitora l’interesse verso la tua impresa e aumenta le possibilità di ricevere nuovi contatti e richieste di preventivo.",
    },
    {
      icon: "🏢",
      title: "Presenta la tua impresa al meglio",
      description:
        "Costruisci una vetrina professionale con informazioni, servizi, immagini e competenze sempre aggiornati.",
    },
    {
      icon: "⚡",
      title: "Gestisci tutto con semplicità",
      description:
        "Aggiorna la tua presenza su EdilRate in autonomia, in pochi minuti e senza intermediari.",
    },
    {
      icon: "🤝",
      title: "Cresci insieme a EdilRate",
      description:
        "Accedi a una piattaforma in continua evoluzione, migliorata anche grazie ai suggerimenti delle imprese.",
    },
  ];
  
  const includedFeatures = [
    "Badge EdilRate PRO",
    "Priorità nei risultati di ricerca",
    "Maggiore evidenza nelle categorie",
    "Risposta pubblica alle recensioni",
    "Statistiche su visite e contatti",
    "QR Code personalizzato per raccogliere recensioni",
    "Accesso agli aggiornamenti dedicati alle imprese PRO",
  ];
  
  const comparison = [
    {
      feature: "Profilo aziendale completo",
      free: true,
      pro: true,
    },
    {
      feature: "Logo, copertina e gallery",
      free: true,
      pro: true,
    },
    {
      feature: "Ricezione delle recensioni",
      free: true,
      pro: true,
    },
    {
      feature: "Ricezione delle richieste di preventivo",
      free: true,
      pro: true,
    },
    {
      feature: "Badge EdilRate PRO",
      free: false,
      pro: true,
    },
    {
      feature: "Priorità nei risultati",
      free: false,
      pro: true,
    },
    {
      feature: "Risposta alle recensioni",
      free: false,
      pro: true,
    },
    {
      feature: "Statistiche del profilo",
      free: false,
      pro: true,
    },
    {
      feature: "QR Code personalizzato",
      free: false,
      pro: true,
    },
  ];
  
  const plans = [
    {
      name: "Mensile",
      plan: "monthly",
      price: "29,90 €",
      period: "al mese",
      description: "Massima flessibilità, senza impegno a lungo termine.",
      highlighted: false,
    },
    {
      name: "Semestrale",
      plan: "semiannual",
      price: "149,90 €",
      period: "ogni 6 mesi",
      description: "Una soluzione conveniente per iniziare a crescere nel tempo.",
      highlighted: false,
    },
    {
      name: "Annuale",
      plan: "annual",
      price: "279,90 €",
      period: "all’anno",
      description: "Il miglior valore per costruire una presenza stabile.",
      highlighted: true,
    },
  ] as const;
  
  const faqs = [
    {
      question: "Il profilo gratuito continuerà a esistere?",
      answer:
        "Sì. Il profilo gratuito rimarrà disponibile e permetterà alle imprese di gestire le informazioni principali, le immagini, le recensioni e le richieste di preventivo.",
    },
    {
      question: "Posso annullare l’abbonamento?",
      answer:
        "Sì. Potrai gestire l’abbonamento dalla tua area personale. L’accesso alle funzioni PRO rimarrà attivo fino alla fine del periodo già pagato.",
    },
    {
      question: "Cosa succede ai miei dati se torno al piano gratuito?",
      answer:
        "Le informazioni principali del profilo non verranno eliminate. Verranno semplicemente disattivate le funzionalità riservate a EdilRate PRO.",
    },
    {
      question: "Posso cambiare durata dell’abbonamento?",
      answer:
        "Sì. La gestione del piano e degli eventuali cambi di durata sarà disponibile nella sezione dedicata all’abbonamento.",
    },
  ];
  
  export default function ProPage() {
    return (
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
  
          <div className="relative mx-auto max-w-7xl px-6 py-20 text-center md:py-28">
            <div className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm">
              ⭐ EdilRate PRO
            </div>
  
            <h1 className="mx-auto mt-8 max-w-5xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-7xl">
              Trasforma il tuo profilo in una vera vetrina professionale
            </h1>
  
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              EdilRate PRO nasce per aiutare le imprese a trasformare la qualità
              del proprio lavoro in fiducia, visibilità e nuove opportunità.
            </p>
  
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#piani"
                className="w-full rounded-2xl bg-black px-8 py-4 font-medium text-white transition hover:bg-gray-800 sm:w-auto"
              >
                Scopri i piani
              </a>
  
              <a
                href="#confronto"
                className="w-full rounded-2xl border bg-white px-8 py-4 font-medium transition hover:bg-gray-50 sm:w-auto"
              >
                Confronta le funzioni
              </a>
            </div>
  
            <p className="mt-5 text-sm text-gray-500">
              A partire da 29,90 € al mese
            </p>
          </div>
        </section>
  
        {/* BENEFICI */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Perché scegliere EdilRate PRO?
            </h2>
  
            <p className="mt-4 text-lg text-gray-600">
              Strumenti semplici e concreti per valorizzare la tua impresa e
              gestire meglio la sua presenza online.
            </p>
          </div>
  
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-3xl border bg-white p-7 shadow-sm"
              >
                <div className="text-4xl">{benefit.icon}</div>
  
                <h3 className="mt-6 text-xl font-semibold">
                  {benefit.title}
                </h3>
  
                <p className="mt-3 leading-7 text-gray-600">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </section>
  
        {/* FUNZIONI INCLUSE */}
        <section className="border-y bg-gray-50">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                EdilRate PRO
              </p>
  
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Tutto ciò che serve per distinguerti
              </h2>
  
              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                Non una raccolta di funzioni complicate, ma strumenti immediati
                pensati per aumentare visibilità, reputazione e opportunità.
              </p>
            </div>
  
            <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
              <ul className="space-y-4">
                {includedFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span
                      className="mt-0.5"
                      aria-hidden="true"
                    >
                      ✅
                    </span>
  
                    <span className="leading-7 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
  
        {/* CONFRONTO */}
        <section
          id="confronto"
          className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 md:py-24"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Gratuito o EdilRate PRO?
            </h2>
  
            <p className="mt-4 text-lg text-gray-600">
              Il profilo gratuito ti permette di essere presente. EdilRate PRO
              ti aiuta a essere scelto.
            </p>
          </div>
  
          <div className="mt-12 overflow-hidden rounded-3xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-5 font-semibold">Funzione</th>
                    <th className="px-6 py-5 text-center font-semibold">
                      Gratuito
                    </th>
                    <th className="px-6 py-5 text-center font-semibold">
                      ⭐ PRO
                    </th>
                  </tr>
                </thead>
  
                <tbody>
                  {comparison.map((item) => (
                    <tr key={item.feature} className="border-b last:border-0">
                      <td className="px-6 py-5 text-gray-700">
                        {item.feature}
                      </td>
  
                      <td className="px-6 py-5 text-center">
                        {item.free ? "✅" : "—"}
                      </td>
  
                      <td className="px-6 py-5 text-center">
                        {item.pro ? "✅" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
  
        {/* PREZZI */}
        <section id="piani" className="scroll-mt-24 border-y bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Scegli la soluzione più adatta alla tua impresa
              </h2>
  
              <p className="mt-4 text-lg text-gray-600">
                Un unico piano PRO con tre modalità di pagamento.
              </p>
            </div>
  
            <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative rounded-3xl border p-7 shadow-sm md:p-8 ${
                    plan.highlighted
                      ? "border-black bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                      Più conveniente
                    </span>
                  )}
  
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
  
                  <div className="mt-7">
                    <span className="text-4xl font-bold">{plan.price}</span>
  
                    <p
                      className={`mt-2 text-sm ${
                        plan.highlighted ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {plan.period}
                    </p>
                  </div>
  
                  <p
                    className={`mt-6 leading-7 ${
                      plan.highlighted ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>
  
                  <ProCheckoutButton
  plan={plan.plan}
  className={`mt-8 w-full rounded-2xl px-5 py-4 font-medium transition ${
    plan.highlighted
      ? "bg-white text-black hover:bg-gray-200"
      : "bg-black text-white hover:bg-gray-800"
  }`}
/>
                </article>
              ))}
            </div>
  
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-gray-500">
              I pagamenti verranno attivati al lancio ufficiale. Le condizioni
              definitive saranno mostrate prima della conferma dell’acquisto.
            </p>
          </div>
        </section>
  
        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 py-20 md:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Domande frequenti
            </h2>
          </div>
  
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border bg-white p-6"
              >
                <summary className="cursor-pointer list-none font-semibold">
                  <div className="flex items-center justify-between gap-4">
                    <span>{faq.question}</span>
                    <span
                      className="text-xl transition group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </div>
                </summary>
  
                <p className="mt-4 leading-7 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
  
        {/* CTA FINALE */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="rounded-3xl bg-black px-6 py-16 text-center text-white md:px-12 md:py-20">
            <h2 className="text-3xl font-bold md:text-5xl">
              Dai più valore alla tua impresa
            </h2>
  
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Investi nella reputazione digitale della tua impresa e valorizza
              il tuo lavoro con strumenti pensati per il settore edilizio.
            </p>
  
            <a
              href="#piani"
              className="mt-9 inline-flex rounded-2xl bg-white px-8 py-4 font-medium text-black transition hover:bg-gray-200"
            >
              Scopri EdilRate PRO
            </a>
          </div>
        </section>
      </main>
    );
  }