"use client";

import Loading from "@/components/ui/Loading";
import StatCard from "@/components/ui/StatCard";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [companiesCount, setCompaniesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [quotesCount, setQuotesCount] = useState(0);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [newFeedbackCount, setNewFeedbackCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data?.role === "admin") {
      setIsAdmin(true);
      await loadStats();
    }

    setLoading(false);
  };

  const loadStats = async () => {
    const { count: companies } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true });

    const { count: reviews } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true });

    const { count: quotes } = await supabase
      .from("quote_requests")
      .select("*", { count: "exact", head: true });

    const { count: pendingClaims } = await supabase
      .from("claim_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: newFeedback } = await supabase
      .from("feedback")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    setCompaniesCount(companies || 0);
    setReviewsCount(reviews || 0);
    setQuotesCount(quotes || 0);
    setPendingClaimsCount(pendingClaims || 0);
    setNewFeedbackCount(newFeedback || 0);
    const { data: latestQuotes } = await supabase
  .from("quote_requests")
  .select("id, created_at, companies(name)")
  .order("created_at", { ascending: false })
  .limit(3);

const { data: latestFeedback } = await supabase
  .from("feedback")
  .select("id, subject, created_at")
  .order("created_at", { ascending: false })
  .limit(3);

  const activities = [
    ...(latestQuotes || []).map((item: any) => ({
      id: `quote-${item.id}`,
      emoji: "📨",
      type: "Preventivo",
      title: "Nuova richiesta preventivo",
      description: item.companies?.name || "Azienda non trovata",
      date: item.created_at,
      href: "/admin/quotes",
    })),
    ...(latestFeedback || []).map((item: any) => ({
      id: `feedback-${item.id}`,
      emoji: "💬",
      type: "Feedback",
      title: "Nuovo feedback ricevuto",
      description: item.subject || "Feedback",
      date: item.created_at,
      href: "/admin/feedback",
    })),
  ]

  .sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  .slice(0, 5);

setRecentActivities(activities);

  };

  if (loading) {
    return <Loading text="Caricamento dashboard..." />;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">Accesso negato</h1>
        <p className="mt-4 text-gray-600">
          Non hai i permessi per visualizzare questa pagina.
        </p>
      </main>
    );
  }

  const stats = [
    {
      label: "Aziende",
      value: companiesCount,
      emoji: "🏢",
      href: "/admin/aziende",
    },
    {
      label: "Recensioni",
      value: reviewsCount,
      emoji: "⭐",
      href: "/admin/reviews",
    },
    {
      label: "Preventivi",
      value: quotesCount,
      emoji: "📨",
      href: "/admin/quotes",
    },
    {
      label: "Claim pending",
      value: pendingClaimsCount,
      emoji: "🏗️",
      href: "/admin/claims",
    },
    {
      label: "Feedback nuovi",
      value: newFeedbackCount,
      emoji: "💬",
      href: "/admin/feedback",
    },
  ];

  const actions = [
    {
      title: "Gestisci aziende",
      description:
        "Consulta, modifica e aggiorna le aziende presenti su EdilRate.",
      href: "/admin/aziende",
      emoji: "🏢",
      value: companiesCount,
      badge: `${companiesCount} totali`,
      priority: false,
    },
    {
      title: "Import aziende",
      description:
        "Carica nuove aziende tramite file Excel e amplia il database.",
      href: "/admin/import",
      emoji: "📥",
      value: null,
      badge: "Import Excel",
      priority: false,
    },
    {
      title: "Gestisci claim",
      description:
        "Approva o rifiuta le richieste di rivendicazione delle aziende.",
      href: "/admin/claims",
      emoji: "🏗️",
      value: pendingClaimsCount,
      badge:
        pendingClaimsCount === 1
          ? "1 in attesa"
          : `${pendingClaimsCount} in attesa`,
      priority: pendingClaimsCount > 0,
    },
    {
      title: "Gestisci feedback",
      description:
        "Leggi suggerimenti, segnalazioni e richieste inviate dagli utenti.",
      href: "/admin/feedback",
      emoji: "💬",
      value: newFeedbackCount,
      badge:
        newFeedbackCount === 1
          ? "1 nuovo"
          : `${newFeedbackCount} nuovi`,
      priority: newFeedbackCount > 0,
    },
    {
      title: "Gestisci recensioni",
      description:
        "Controlla e modera le recensioni pubblicate sulla piattaforma.",
      href: "/admin/reviews",
      emoji: "⭐",
      value: reviewsCount,
      badge: `${reviewsCount} pubblicate`,
      priority: false,
    },
    {
      title: "Gestisci preventivi",
      description:
        "Monitora le richieste di preventivo inviate alle imprese.",
      href: "/admin/quotes",
      emoji: "📨",
      value: quotesCount,
      badge: `${quotesCount} richieste`,
      priority: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="overflow-hidden rounded-[36px] border bg-white shadow-sm">
  <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
          Control Room
        </span>

        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          Amministrazione EdilRate
        </span>

        {(pendingClaimsCount > 0 || newFeedbackCount > 0) && (
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            Azioni richieste
          </span>
        )}
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
        Bentornato, Thomas 👋
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Monitora aziende, richieste, recensioni e attività della piattaforma
        da un unico spazio operativo.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href="/admin/claims"
          className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Gestisci claim
        </a>

        <a
          href="/admin/import"
          className="inline-flex items-center justify-center rounded-2xl border bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-100"
        >
          Importa aziende
        </a>
      </div>
    </div>

    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:min-w-[300px] lg:grid-cols-1">
      <a
        href="/admin/claims"
        className="rounded-3xl border bg-gray-50 p-5 transition hover:border-black hover:bg-white"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Claim da verificare
        </p>

        <p className="mt-2 text-3xl font-bold text-black">
          {pendingClaimsCount}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {pendingClaimsCount === 1
            ? "richiesta in attesa"
            : "richieste in attesa"}
        </p>
      </a>

      <a
        href="/admin/feedback"
        className="rounded-3xl border bg-gray-50 p-5 transition hover:border-black hover:bg-white"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Feedback nuovi
        </p>

        <p className="mt-2 text-3xl font-bold text-black">
          {newFeedbackCount}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {newFeedbackCount === 1
            ? "messaggio da leggere"
            : "messaggi da leggere"}
        </p>
      </a>
    </div>
  </div>

  <div className="flex flex-col gap-3 border-t bg-gray-50/70 px-7 py-4 sm:flex-row sm:items-center sm:justify-between md:px-10">
    <p className="text-sm text-gray-500">
      Panoramica aggiornata con i dati della piattaforma.
    </p>

    <a
      href="/"
      className="inline-flex items-center text-sm font-medium text-black transition hover:opacity-60"
    >
      Vai al sito pubblico
      <span className="ml-2">↗</span>
    </a>
  </div>
</div>

<div className="mt-10">
  <p className="text-sm font-medium text-gray-500">
    Panoramica piattaforma
  </p>

  <h2 className="mt-1 text-2xl font-semibold">
    Numeri principali
  </h2>
</div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
  <StatCard
    key={item.label}
    emoji={item.emoji}
    label={item.label}
    value={item.value}
    href={item.href}
  />
))}
        </div>

        <div className="mt-12">
  <p className="text-sm font-medium text-gray-500">
    Strumenti amministrativi
  </p>

  <h2 className="mt-1 text-2xl font-semibold">
    Azioni rapide
  </h2>

  <p className="mt-2 text-sm text-gray-600">
    Accedi alle principali aree di gestione della piattaforma.
  </p>

  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  {actions.map((action) => (
    <a
      key={action.title}
      href={action.href}
      className={`group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        action.priority
          ? "border-orange-200"
          : "hover:border-black"
      }`}
    >
      {action.priority && (
        <div className="absolute inset-x-0 top-0 h-1 bg-orange-400" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
            action.priority
              ? "bg-orange-100"
              : "bg-gray-100"
          }`}
        >
          {action.emoji}
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            action.priority
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {action.badge}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-tight text-black">
        {action.title}
      </h3>

      <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-600">
        {action.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t pt-5">
        <span className="text-sm font-medium text-black">
          Apri sezione
        </span>

        <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
          →
        </span>
      </div>
    </a>
  ))}
</div>
        </div>
        <div className="mt-12">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Feed operativo
      </p>

      <h2 className="mt-1 text-2xl font-semibold">
        Attività recenti
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Ultimi eventi registrati sulla piattaforma.
      </p>
    </div>

    <span className="self-start rounded-full border bg-white px-4 py-2 text-sm font-medium text-gray-700 sm:self-auto">
      Ultime {recentActivities.length}
    </span>
  </div>

  <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">
    {recentActivities.length > 0 ? (
      <div className="divide-y">
        {recentActivities.map((activity) => (
          <a
            key={activity.id}
            href={activity.href}
            className="group flex flex-col gap-5 p-6 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                {activity.emoji}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {activity.type}
                  </span>

                  <span className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="mt-3 font-semibold text-black">
                  {activity.title}
                </h3>

                <p className="mt-1 truncate text-sm text-gray-600">
                  {activity.description}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
              <span className="text-xs text-gray-400">
                {new Date(activity.date).toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span className="text-lg text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    ) : (
      <div className="px-6 py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          🕘
        </div>

        <h3 className="mt-5 text-lg font-semibold text-black">
          Nessuna attività recente
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Le nuove richieste di preventivo e i feedback ricevuti appariranno qui.
        </p>
      </div>
    )}
  </div>
</div>
      </section>
    </main>
  );
}