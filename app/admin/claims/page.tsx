"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
  "all" | "pending" | "approved" | "rejected"
>("pending");
  const [processingClaimId, setProcessingClaimId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

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
      await loadClaims();
    }
  
    setLoading(false);
  };

  const loadClaims = async () => {
    const { data, error } = await supabase
      .from("claim_requests")
      .select(`
        id,
        company_id,
        user_id,
        status,
        created_at,
        companies (
        name,
        slug,
        city,
        category
        ),
        profiles (
          full_name
        )
      `)
      .order("created_at", { ascending: false });

      if (error) {
        showToast(error.message, "error");
        return;
      }

    setClaims(data || []);
  };

  const approveClaim = async (claim: any) => {
    setProcessingClaimId(claim.id);
  
    const { error: companyError } = await supabase
      .from("companies")
      .update({
        claimed: true,
        claimed_by: claim.user_id,
      })
      .eq("id", claim.company_id);
  
    if (companyError) {
      showToast(companyError.message, "error");
      setProcessingClaimId(null);
      return;
    }
  
    const { error: claimError } = await supabase
      .from("claim_requests")
      .update({
        status: "approved",
      })
      .eq("id", claim.id);
  
    if (claimError) {
      await supabase
        .from("companies")
        .update({
          claimed: false,
          claimed_by: null,
        })
        .eq("id", claim.company_id);
  
      showToast(
        `Impossibile completare l’approvazione: ${claimError.message}`,
        "error"
      );
  
      setProcessingClaimId(null);
      return;
    }
  
    showToast("Richiesta di rivendicazione approvata.");
    await loadClaims();
    setProcessingClaimId(null);
  };

  const rejectClaim = async (claim: any) => {
    setProcessingClaimId(claim.id);
  
    const { error } = await supabase
      .from("claim_requests")
      .update({
        status: "rejected",
      })
      .eq("id", claim.id);
  
    if (error) {
      showToast(error.message, "error");
      setProcessingClaimId(null);
      return;
    }
  
    showToast("Richiesta di rivendicazione rifiutata.");
    await loadClaims();
    setProcessingClaimId(null);
  };

  const pendingClaims = claims.filter(
    (claim) => claim.status === "pending"
  ).length;
  
  const approvedClaims = claims.filter(
    (claim) => claim.status === "approved"
  ).length;
  
  const rejectedClaims = claims.filter(
    (claim) => claim.status === "rejected"
  ).length;
  
  const filteredClaims =
    statusFilter === "all"
      ? claims
      : claims.filter(
          (claim) => claim.status === statusFilter
        );
  
  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700">
            In attesa
          </span>
        );
  
      case "approved":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
            Approvata
          </span>
        );
  
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
            Rifiutata
          </span>
        );
  
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return <Loading text="Caricamento richieste..." />;
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
          Gestione claim
        </span>

        {pendingClaims > 0 && (
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
            {pendingClaims} da verificare
          </span>
        )}
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
        Richieste di rivendicazione
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Verifica le richieste ricevute e assegna i profili aziendali
        ai rispettivi proprietari.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
      <div className="rounded-3xl border bg-orange-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {pendingClaims}
        </p>

        <p className="mt-1 text-xs font-medium text-orange-700">
          In attesa
        </p>
      </div>

      <div className="rounded-3xl border bg-green-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {approvedClaims}
        </p>

        <p className="mt-1 text-xs font-medium text-green-700">
          Approvate
        </p>
      </div>

      <div className="rounded-3xl border bg-red-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {rejectedClaims}
        </p>

        <p className="mt-1 text-xs font-medium text-red-700">
          Rifiutate
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
        label: `In attesa (${pendingClaims})`,
      },
      {
        value: "approved",
        label: `Approvate (${approvedClaims})`,
      },
      {
        value: "rejected",
        label: `Rifiutate (${rejectedClaims})`,
      },
      {
        value: "all",
        label: `Tutte (${claims.length})`,
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
              | "approved"
              | "rejected"
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
  {filteredClaims.length > 0 ? (
    filteredClaims.map((claim) => (
      <article
        key={claim.id}
        className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md"
      >
        <div className="p-6 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                {getClaimStatusBadge(claim.status)}

                <span className="text-xs text-gray-400">
                  {new Date(claim.created_at).toLocaleDateString(
                    "it-IT",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-black">
                {claim.companies?.name ||
                  "Azienda non trovata"}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                <span>
                  {claim.companies?.category ||
                    "Categoria non indicata"}
                </span>

                <span className="text-gray-300">•</span>

                <span>
                  {claim.companies?.city ||
                    "Città non indicata"}
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Richiesta inviata da
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white border font-semibold text-black">
                    {(
                      claim.profiles?.full_name ||
                      "U"
                    )
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-black">
                      {claim.profiles?.full_name ||
                        "Utente EdilRate"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      ID utente: {claim.user_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {claim.status === "pending" ? (
              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[240px] lg:flex-col">
                <Button
                  onClick={() => approveClaim(claim)}
                  disabled={
                    processingClaimId === claim.id
                  }
                  className="w-full"
                >
                  {processingClaimId === claim.id
                    ? "Elaborazione..."
                    : "Approva richiesta"}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => rejectClaim(claim)}
                  disabled={
                    processingClaimId === claim.id
                  }
                  className="w-full"
                >
                  Rifiuta richiesta
                </Button>

                {claim.companies?.slug && (
  <a
    href={`/imprese/${claim.companies.slug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-black"
  >
    Verifica profilo ↗
  </a>
)}
              </div>
            ) : (
              <div className="shrink-0 rounded-2xl bg-gray-50 px-5 py-4 text-sm text-gray-500">
                Richiesta già gestita
              </div>
            )}
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
        Nessuna richiesta in questa sezione
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Non sono presenti richieste con lo stato selezionato.
      </p>

      {statusFilter !== "all" && (
        <Button
          variant="secondary"
          onClick={() => setStatusFilter("all")}
          className="mt-6"
        >
          Mostra tutte le richieste
        </Button>
      )}
    </div>
  )}
</div>
      </section>
    </main>
  );
}