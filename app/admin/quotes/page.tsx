"use client";

import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AdminQuotesPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");

const [statusFilter, setStatusFilter] = useState<
  "all" | "pending" | "contacted" | "closed"
>("pending");

const [processingQuoteId, setProcessingQuoteId] =
  useState<string | null>(null);

const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState<
  "success" | "error"
>("success");

  useEffect(() => {
    checkAdmin();
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastType(type);
    setToastMessage(message);
  
    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (error) {
  showToast(error.message, "error");
  setLoading(false);
  return;
}

    if (data?.role === "admin") {
      setIsAdmin(true);
      await loadQuotes();
    }

    setLoading(false);
  };

  const loadQuotes = async () => {
    const { data, error } = await supabase
      .from("quote_requests")
      .select(`
        id,
        company_id,
        customer_name,
        customer_email,
        customer_phone,
        message,
        status,
        created_at,
        companies (
        name,
        slug,
        city,
        category
        )
      `)
      .order("created_at", { ascending: false });

      if (error) {
        showToast(error.message, "error");
        return;
      }

    setQuotes(data || []);
  };

  const updateStatus = async (
    id: string,
    status: "pending" | "contacted" | "closed"
  ) => {
    setProcessingQuoteId(id);
  
    const { error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", id);
  
    if (error) {
      showToast(error.message, "error");
      setProcessingQuoteId(null);
      return;
    }
  
    const messages = {
      pending: "Richiesta riportata tra quelle da gestire.",
      contacted: "Richiesta segnata come contattata.",
      closed: "Richiesta chiusa correttamente.",
    };
  
    showToast(messages[status]);
    await loadQuotes();
    setProcessingQuoteId(null);
  };

  const pendingQuotesCount = quotes.filter(
    (quote) => (quote.status || "pending") === "pending"
  ).length;
  
  const contactedQuotesCount = quotes.filter(
    (quote) => quote.status === "contacted"
  ).length;
  
  const closedQuotesCount = quotes.filter(
    (quote) => quote.status === "closed"
  ).length;
  
  const filteredQuotes = quotes.filter((quote) => {
    const searchableText = `
      ${quote.customer_name || ""}
      ${quote.customer_email || ""}
      ${quote.customer_phone || ""}
      ${quote.message || ""}
      ${quote.companies?.name || ""}
      ${quote.companies?.city || ""}
      ${quote.companies?.category || ""}
    `.toLowerCase();
  
    const matchesSearch = searchableText.includes(
      search.toLowerCase().trim()
    );
  
    const matchesStatus =
      statusFilter === "all"
        ? true
        : (quote.status || "pending") === statusFilter;
  
    return matchesSearch && matchesStatus;
  });
  
  const getQuoteStatusBadge = (status?: string) => {
    switch (status || "pending") {
      case "pending":
        return (
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700">
            Da gestire
          </span>
        );
  
      case "contacted":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700">
            Contattata
          </span>
        );
  
      case "closed":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
            Chiusa
          </span>
        );
  
      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return <Loading text="Caricamento preventivi..." />;
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

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <Toast
  message={toastMessage}
  type={toastType}
  onClose={() => setToastMessage("")}
/>
      <section className="max-w-6xl mx-auto px-6 py-12">
      <a
  href="/admin"
  className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-black"
>
  ← Torna alla Control Room
</a>

<div className="mt-6 overflow-hidden rounded-[36px] border bg-white shadow-sm">
  <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
          Monitoraggio preventivi
        </span>

        {pendingQuotesCount > 0 && (
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            {pendingQuotesCount} da gestire
          </span>
        )}
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
        Richieste di preventivo
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Monitora i contatti generati da EdilRate e controlla lo stato
        delle richieste inviate alle aziende.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-3 lg:min-w-[390px]">
      <div className="rounded-3xl border bg-orange-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {pendingQuotesCount}
        </p>

        <p className="mt-1 text-xs font-medium text-orange-700">
          Da gestire
        </p>
      </div>

      <div className="rounded-3xl border bg-blue-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {contactedQuotesCount}
        </p>

        <p className="mt-1 text-xs font-medium text-blue-700">
          Contattate
        </p>
      </div>

      <div className="rounded-3xl border bg-green-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {closedQuotesCount}
        </p>

        <p className="mt-1 text-xs font-medium text-green-700">
          Chiuse
        </p>
      </div>
    </div>
  </div>
</div>

<div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm md:p-6">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div className="w-full lg:max-w-xl">
      <label
        htmlFor="admin-quotes-search"
        className="text-sm font-medium text-black"
      >
        Cerca richieste
      </label>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔎
        </span>

        <input
          id="admin-quotes-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cliente, azienda, email, telefono..."
          className="w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
        />
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {[
        {
          value: "pending",
          label: `Da gestire (${pendingQuotesCount})`,
        },
        {
          value: "contacted",
          label: `Contattate (${contactedQuotesCount})`,
        },
        {
          value: "closed",
          label: `Chiuse (${closedQuotesCount})`,
        },
        {
          value: "all",
          label: `Tutte (${quotes.length})`,
        },
      ].map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() =>
            setStatusFilter(
              filter.value as
                | "all"
                | "pending"
                | "contacted"
                | "closed"
            )
          }
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            statusFilter === filter.value
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  </div>
</div>

<div className="mt-8">
  <div className="mb-5">
    <p className="text-sm font-medium text-gray-500">
      Risultati
    </p>

    <p className="mt-1 text-lg font-semibold text-black">
      {filteredQuotes.length}{" "}
      {filteredQuotes.length === 1
        ? "richiesta trovata"
        : "richieste trovate"}
    </p>
  </div>

  <div className="space-y-5">
    {filteredQuotes.length > 0 ? (
      filteredQuotes.map((quote) => (
        <article
          key={quote.id}
          className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
            (quote.status || "pending") === "pending"
              ? "border-orange-200"
              : ""
          }`}
        >
          <div className="p-6 md:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  {getQuoteStatusBadge(quote.status)}

                  <span className="text-xs text-gray-400">
                    {new Date(quote.created_at).toLocaleDateString(
                      "it-IT",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-lg font-semibold text-black">
                    {(quote.customer_name || "C")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold text-black">
                      {quote.customer_name ||
                        "Cliente senza nome"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Richiesta preventivo
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Azienda destinataria
                  </p>

                  <div className="mt-3">
                    {quote.companies?.slug ? (
                      <a
                        href={`/imprese/${quote.companies.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-black transition hover:opacity-60"
                      >
                        {quote.companies?.name ||
                          "Azienda non trovata"}{" "}
                        ↗
                      </a>
                    ) : (
                      <p className="font-semibold text-black">
                        {quote.companies?.name ||
                          "Azienda non trovata"}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-500">
                      {[
                        quote.companies?.category,
                        quote.companies?.city,
                      ]
                        .filter(Boolean)
                        .join(" · ") ||
                        "Informazioni azienda non disponibili"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {quote.customer_email && (
                    <a
                      href={`mailto:${quote.customer_email}`}
                      className="flex items-center gap-3 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        ✉️
                      </span>

                      <span className="min-w-0">
                        <span className="block text-xs text-gray-500">
                          Email
                        </span>

                        <span className="mt-1 block truncate text-sm font-medium text-black">
                          {quote.customer_email}
                        </span>
                      </span>
                    </a>
                  )}

                  {quote.customer_phone && (
                    <a
                      href={`tel:${quote.customer_phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-3 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        📞
                      </span>

                      <span className="min-w-0">
                        <span className="block text-xs text-gray-500">
                          Telefono
                        </span>

                        <span className="mt-1 block truncate text-sm font-medium text-black">
                          {quote.customer_phone}
                        </span>
                      </span>
                    </a>
                  )}
                </div>

                <div className="mt-5 rounded-2xl border p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Descrizione del lavoro
                  </p>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">
                    {quote.message ||
                      "Nessuna descrizione fornita."}
                  </p>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Ricevuta alle{" "}
                  {new Date(quote.created_at).toLocaleTimeString(
                    "it-IT",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[220px] lg:flex-col">
                {(quote.status || "pending") !== "pending" && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      updateStatus(quote.id, "pending")
                    }
                    disabled={
                      processingQuoteId === quote.id
                    }
                    className="w-full"
                  >
                    Riporta da gestire
                  </Button>
                )}

                {(quote.status || "pending") !== "contacted" && (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      updateStatus(quote.id, "contacted")
                    }
                    disabled={
                      processingQuoteId === quote.id
                    }
                    className="w-full"
                  >
                    Segna contattata
                  </Button>
                )}

                {(quote.status || "pending") !== "closed" && (
                  <Button
                    onClick={() =>
                      updateStatus(quote.id, "closed")
                    }
                    disabled={
                      processingQuoteId === quote.id
                    }
                    className="w-full"
                  >
                    {processingQuoteId === quote.id
                      ? "Aggiornamento..."
                      : "Chiudi richiesta"}
                  </Button>
                )}

                {(quote.status || "pending") === "closed" && (
                  <div className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-green-50 px-5 py-3 text-sm font-medium text-green-700">
                    ✓ Richiesta chiusa
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))
    ) : search || statusFilter !== "all" ? (
      <div className="rounded-3xl border bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          🔎
        </div>

        <h2 className="mt-5 text-xl font-semibold text-black">
          Nessuna richiesta trovata
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Modifica la ricerca oppure seleziona un altro stato.
        </p>

        <Button
          variant="secondary"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          className="mt-6"
        >
          Azzera filtri
        </Button>
      </div>
    ) : (
      <div className="rounded-3xl border bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          📨
        </div>

        <h2 className="mt-5 text-xl font-semibold text-black">
          Nessuna richiesta ricevuta
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Le richieste inviate dagli utenti compariranno qui.
        </p>
      </div>
    )}
  </div>
</div>
      </section>
    </main>
  );
}