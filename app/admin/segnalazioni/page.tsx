"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";

type SuggestionStatus = "pending" | "added" | "rejected";

type CompanySuggestion = {
  id: string;
  company_name: string;
  city: string;
  province: string | null;
  website: string | null;
  email: string | null;
  company_id: string | null;
  notes: string | null;
  status: SuggestionStatus;
  created_at: string;
};

type CompanySearchResult = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  province: string | null;
};

export default function AdminSegnalazioniPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | SuggestionStatus
  >("pending");

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [companySearch, setCompanySearch] = useState<
  Record<string, string>
>({});

const [companyResults, setCompanyResults] = useState<
  Record<string, CompanySearchResult[]>
>({});

const [selectedCompany, setSelectedCompany] = useState<
  Record<string, CompanySearchResult | null>
>({});

const [searchingCompanyId, setSearchingCompanyId] =
  useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] =
    useState<"success" | "error">("success");

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

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  };

  const loadSuggestions = async () => {
    const session = await getSession();

    if (!session) {
      showToast(
        "Sessione non valida. Effettua nuovamente l'accesso.",
        "error"
      );
      return;
    }

    const response = await fetch("/api/admin/company-suggestions", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(
        data.error || "Impossibile recuperare le segnalazioni.",
        "error"
      );
      return;
    }

    setSuggestions(data.suggestions || []);
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
      await loadSuggestions();
    }

    setLoading(false);
  };

  const searchCompanies = async (
    suggestionId: string,
    search: string
  ) => {
    const query = search.trim();
  
    if (!query) {
      setCompanyResults((current) => ({
        ...current,
        [suggestionId]: [],
      }));
      return;
    }
  
    setSearchingCompanyId(suggestionId);
  
    try {
      const session = await getSession();
  
      if (!session) {
        showToast(
          "Sessione non valida. Effettua nuovamente l'accesso.",
          "error"
        );
        return;
      }
  
      const response = await fetch(
        `/api/admin/companies?search=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        showToast(
          data.error || "Impossibile cercare le aziende.",
          "error"
        );
        return;
      }
  
      setCompanyResults((current) => ({
        ...current,
        [suggestionId]: data.companies || [],
      }));
    } catch (error) {
      console.error("Company search error:", error);
  
      showToast(
        "Si è verificato un errore durante la ricerca.",
        "error"
      );
    } finally {
      setSearchingCompanyId(null);
    }
  };

  const updateStatus = async (
    id: string,
    status: SuggestionStatus
  ) => {
    if (status === "added" && !selectedCompany[id]) {
      showToast(
        "Seleziona prima l'impresa che hai aggiunto a EdilRate.",
        "error"
      );
      return;
    }
    setProcessingId(id);

    try {
      const session = await getSession();

      if (!session) {
        showToast(
          "Sessione non valida. Effettua nuovamente l'accesso.",
          "error"
        );
        return;
      }

      const response = await fetch(
        "/api/admin/company-suggestions",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            id,
            status,
            companyId:
              status === "added"
                ? selectedCompany[id]?.id || null
                : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.error || "Impossibile aggiornare la segnalazione.",
          "error"
        );
        return;
      }

      const messages: Record<SuggestionStatus, string> = {
        pending: "Segnalazione riportata tra quelle da aggiungere.",
        added: "Impresa segnata come aggiunta.",
        rejected: "Segnalazione scartata.",
      };

      showToast(messages[status]);
      await loadSuggestions();
    } catch (error) {
      console.error("Company suggestion status error:", error);

      showToast(
        "Si è verificato n errore durante l'aggiornamento.",
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = suggestions.filter(
    (item) => item.status === "pending"
  ).length;

  const addedCount = suggestions.filter(
    (item) => item.status === "added"
  ).length;

  const rejectedCount = suggestions.filter(
    (item) => item.status === "rejected"
  ).length;

  const filteredSuggestions =
    statusFilter === "all"
      ? suggestions
      : suggestions.filter(
          (item) => item.status === statusFilter
        );

  const getStatusBadge = (status: SuggestionStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700">
            Da aggiungere
          </span>
        );

      case "added":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
            Aggiunta
          </span>
        );

      case "rejected":
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
            Scartata
          </span>
        );
    }
  };

  if (loading) {
    return <Loading text="Caricamento segnalazioni..." />;
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

      <section className="mx-auto max-w-6xl px-6 py-12">
        <a
          href="/admin"
          className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-black"
        >
          ←Torna alla Control Room
        </a>

        <div className="mt-6 overflow-hidden rounded-[36px] border bg-white shadow-sm">
          <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                  Segnalazioni imprese
                </span>

                {pendingCount > 0 && (
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
                    {pendingCount} da gestire
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                Imprese segnalate
              </h1>

              <p className="mt-4 max-w-2xl text-gray-600">
                Verifica le imprese segnalate dagli utenti e aggiorna
                lo stato dopo averle aggiunte a EdilRate.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:min-w-[380px]">
              <div className="rounded-3xl border bg-orange-50 p-4 text-center">
                <p className="text-2xl font-bold text-black">
                  {pendingCount}
                </p>

                <p className="mt-1 text-xs font-medium text-orange-700">
                  Da aggiungere
                </p>
              </div>

              <div className="rounded-3xl border bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-black">
                  {addedCount}
                </p>

                <p className="mt-1 text-xs font-medium text-green-700">
                  Aggiunte
                </p>
              </div>

              <div className="rounded-3xl border bg-gray-50 p-4 text-center">
                <p className="text-2xl font-bold text-black">
                  {rejectedCount}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-600">
                  Scartate
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {[
              {
                value: "pending",
                label: `Da aggiungere (${pendingCount})`,
              },
              {
                value: "added",
                label: `Aggiunte (${addedCount})`,
              },
              {
                value: "rejected",
                label: `Scartate (${rejectedCount})`,
              },
              {
                value: "all",
                label: `Tutte (${suggestions.length})`,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    filter.value as
                      | "all"
                      | SuggestionStatus
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

        <div className="mt-8 space-y-5">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item) => (
              <article
                key={item.id}
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
                  item.status === "pending"
                    ? "border-orange-200"
                    : ""
                }`}
              >
                <div className="p-6 md:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {getStatusBadge(item.status)}

                        <span className="text-xs text-gray-400">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h2 className="mt-5 text-2xl font-semibold text-black">
                        {item.company_name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-600">
                        📍 {item.city}
                        {item.province
                          ? ` · ${item.province}`
                          : ""}
                      </p>

                   {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block break-all text-sm font-medium text-gray-600 underline transition hover:text-black"
                        >
                          {item.website}
                        </a>
                      )}

                      {item.notes && (
                        <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Informazioni aggiuntive
                          </p>

                          <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">
                            {item.notes}
                          </p>
                        </div>
                      )}

                      <p className="mt-4 text-xs text-gray-400">
                        Ricevuta alle{" "}
                        {new Date(
                          item.created_at
                        ).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {item.status === "pending" && (
  <div className="mt-6 rounded-2xl border bg-gray-50 p-5">
    <p className="text-sm font-semibold text-black">
      Collega l&apos;impresa aggiunta
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Cerca l&apos;impresa dopo averla aggiunta a EdilRate e
      selezionala prima di segnare la segnalazione come aggiunta.
    </p>

    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={
          companySearch[item.id] ??
          item.company_name
        }
        onChange={(e) => {
          const value = e.target.value;

          setCompanySearch((current) => ({
            ...current,
            [item.id]: value,
          }));

          setSelectedCompany((current) => ({
            ...current,
            [item.id]: null,
          }));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();

            searchCompanies(
              item.id,
              companySearch[item.id] ??
                item.company_name
            );
          }
        }}
        placeholder="Cerca impresa..."
        className="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />

      <Button
        variant="secondary"
        onClick={() =>
          searchCompanies(
            item.id,
            companySearch[item.id] ??
              item.company_name
          )
        }
        disabled={searchingCompanyId === item.id}
      >
        {searchingCompanyId === item.id
          ? "Ricerca..."
          : "Cerca"}
      </Button>
    </div>

    {(companyResults[item.id] || []).length > 0 && (
      <div className="mt-3 space-y-2">
        {(companyResults[item.id] || []).map(
          (company) => {
            const isSelected =
              selectedCompany[item.id]?.id ===
              company.id;

            return (
              <button
                key={company.id}
                type="button"
                onClick={() =>
                  setSelectedCompany((current) => ({
                    ...current,
                    [item.id]: company,
                  }))
                }
                className={`w-full rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-black bg-white ring-2 ring-black/5"
                    : "bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-black">
                      {company.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {company.city || "Città non indicata"}
                      {company.province
                        ? ` · ${company.province}`
                        : ""}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      isSelected
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isSelected
                      ? "Selezionata"
                      : "Seleziona"}
                  </span>
                </div>
              </button>
            );
          }
        )}
      </div>
    )}

    {selectedCompany[item.id] && (
      <div className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
        ✓ Collegata a{" "}
        <strong>
          {selectedCompany[item.id]?.name}
        </strong>
      </div>
    )}
  </div>
)}
                    </div>

                    <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[220px] lg:flex-col">
                      {item.status !== "pending" && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            updateStatus(item.id, "pending")
                          }
                          disabled={processingId === item.id}
                          className="w-full"
                        >
                          Riporta da gestire
                        </Button>
                      )}

                      {item.status !== "added" && (
                        <Button
                          onClick={() =>
                            updateStatus(item.id, "added")
                          }
                          disabled={processingId === item.id}
                          className="w-full"
                        >
                          {processingId === item.id
                            ? "Aggiornamento..."
                            : "Segna come aggiunta"}
                        </Button>
                      )}

                      {item.status !== "rejected" && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            updateStatus(item.id, "rejected")
                          }
                          disabled={processingId === item.id}
                          className="w-full"
                        >
                          Scarta segnalazione
                        </Button>
                      )}

                      {item.status === "added" && (
                        <div className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-green-50 px-5 py-3 text-sm font-medium text-green-700">
                          ✓ Impresa aggiunta
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                🏗️
              </div>

              <h2 className="mt-5 text-xl font-semibold text-black">
                Nessuna segnalazione in questa sezione
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Non sono presenti imprese con lo stato selezionato.
              </p>

              {statusFilter !== "all" && (
                <Button
                  variant="secondary"
                  onClick={() => setStatusFilter("all")}
                  className="mt-6"
                >
                  Mostra tutte le segnalazioni
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
