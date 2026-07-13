"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";

export default function AdminFeedbackPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<
  "all" | "new" | "in_progress" | "resolved"
>("new");

const [processingFeedbackId, setProcessingFeedbackId] =
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
      await loadFeedbacks();
    }

    setLoading(false);
  };

  const loadFeedbacks = async () => {
    const { data, error } = await supabase
  .from("feedback")
  .select("*")
  .order("created_at", { ascending: false });

  if (error) {
    showToast(error.message, "error");
    return;
  }

    setFeedbacks(data || []);
  };

  const updateStatus = async (
    id: string,
    status: "new" | "in_progress" | "resolved"
  ) => {
    setProcessingFeedbackId(id);
  
    const { error } = await supabase
      .from("feedback")
      .update({ status })
      .eq("id", id);
  
    if (error) {
      showToast(error.message, "error");
      setProcessingFeedbackId(null);
      return;
    }
  
    const messages = {
      new: "Feedback riportato tra i nuovi.",
      in_progress: "Feedback segnato come in lavorazione.",
      resolved: "Feedback segnato come risolto.",
    };
  
    showToast(messages[status]);
    await loadFeedbacks();
    setProcessingFeedbackId(null);
  };

  const newFeedbacksCount = feedbacks.filter(
    (item) => (item.status || "new") === "new"
  ).length;
  
  const inProgressFeedbacksCount = feedbacks.filter(
    (item) => item.status === "in_progress"
  ).length;
  
  const resolvedFeedbacksCount = feedbacks.filter(
    (item) => item.status === "resolved"
  ).length;
  
  const filteredFeedbacks =
    statusFilter === "all"
      ? feedbacks
      : feedbacks.filter(
          (item) =>
            (item.status || "new") === statusFilter
        );
  
  const getFeedbackStatusBadge = (status?: string) => {
    switch (status || "new") {
      case "new":
        return (
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700">
            Nuovo
          </span>
        );
  
      case "in_progress":
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700">
            In lavorazione
          </span>
        );
  
      case "resolved":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
            Risolto
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
    return <Loading text="Caricamento feedback..." />;
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
          Inbox feedback
        </span>

        {newFeedbacksCount > 0 && (
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            {newFeedbacksCount} da leggere
          </span>
        )}
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
        Feedback ricevuti
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Leggi suggerimenti, segnalazioni e richieste inviate dagli utenti
        durante l’utilizzo di EdilRate.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-3 lg:min-w-[380px]">
      <div className="rounded-3xl border bg-orange-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {newFeedbacksCount}
        </p>

        <p className="mt-1 text-xs font-medium text-orange-700">
          Nuovi
        </p>
      </div>

      <div className="rounded-3xl border bg-blue-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {inProgressFeedbacksCount}
        </p>

        <p className="mt-1 text-xs font-medium text-blue-700">
          In corso
        </p>
      </div>

      <div className="rounded-3xl border bg-green-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {resolvedFeedbacksCount}
        </p>

        <p className="mt-1 text-xs font-medium text-green-700">
          Risolti
        </p>
      </div>
    </div>
  </div>
</div>

<div className="mt-8 rounded-3xl border bg-white p-4 shadow-sm">
  <div className="flex flex-wrap gap-2">
    {[
      {
        value: "new",
        label: `Nuovi (${newFeedbacksCount})`,
      },
      {
        value: "in_progress",
        label: `In lavorazione (${inProgressFeedbacksCount})`,
      },
      {
        value: "resolved",
        label: `Risolti (${resolvedFeedbacksCount})`,
      },
      {
        value: "all",
        label: `Tutti (${feedbacks.length})`,
      },
    ].map((filter) => (
      <button
        key={filter.value}
        type="button"
        onClick={() =>
          setStatusFilter(
            filter.value as
              | "all"
              | "new"
              | "in_progress"
              | "resolved"
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
  {filteredFeedbacks.length > 0 ? (
    filteredFeedbacks.map((item) => (
      <article
        key={item.id}
        className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
          (item.status || "new") === "new"
            ? "border-orange-200"
            : ""
        }`}
      >
        <div className="p-6 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                {getFeedbackStatusBadge(item.status)}

                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  {item.subject || "Senza oggetto"}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString(
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
                  {(item.name || "U")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold text-black">
                    {item.name || "Utente anonimo"}
                  </h2>

                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="mt-1 block truncate text-sm text-gray-500 transition hover:text-black"
                    >
                      {item.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Messaggio
                </p>

                <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">
                  {item.message || "Nessun messaggio fornito."}
                </p>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Ricevuto alle{" "}
                {new Date(item.created_at).toLocaleTimeString(
                  "it-IT",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[220px] lg:flex-col">
              {(item.status || "new") !== "new" && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateStatus(item.id, "new")
                  }
                  disabled={
                    processingFeedbackId === item.id
                  }
                  className="w-full"
                >
                  Segna come nuovo
                </Button>
              )}

              {(item.status || "new") !== "in_progress" && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateStatus(item.id, "in_progress")
                  }
                  disabled={
                    processingFeedbackId === item.id
                  }
                  className="w-full"
                >
                  In lavorazione
                </Button>
              )}

              {(item.status || "new") !== "resolved" && (
                <Button
                  onClick={() =>
                    updateStatus(item.id, "resolved")
                  }
                  disabled={
                    processingFeedbackId === item.id
                  }
                  className="w-full"
                >
                  {processingFeedbackId === item.id
                    ? "Aggiornamento..."
                    : "Segna come risolto"}
                </Button>
              )}

              {(item.status || "new") === "resolved" && (
                <div className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-green-50 px-5 py-3 text-sm font-medium text-green-700">
                  ✓ Feedback risolto
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
        💬
      </div>

      <h2 className="mt-5 text-xl font-semibold text-black">
        Nessun feedback in questa sezione
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Non sono presenti messaggi con lo stato selezionato.
      </p>

      {statusFilter !== "all" && (
        <Button
          variant="secondary"
          onClick={() => setStatusFilter("all")}
          className="mt-6"
        >
          Mostra tutti i feedback
        </Button>
      )}
    </div>
  )}
</div>
      </section>
    </main>
  );
}