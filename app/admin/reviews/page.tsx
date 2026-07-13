"use client";

import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AdminReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState("");
const [ratingFilter, setRatingFilter] = useState<
  "all" | "5" | "4" | "3" | "2" | "1"
>("all");

const [deletingReviewId, setDeletingReviewId] =
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
      await loadReviews();
    }
  
    setLoading(false);
  };

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        companies (
          name,
          slug
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
  
    setReviews(data || []);
  };

  const deleteReview = async (id: string) => {
    const confirmDelete = window.confirm(
      "Vuoi eliminare definitivamente questa recensione?"
    );
  
    if (!confirmDelete) return;
  
    setDeletingReviewId(id);
  
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);
  
    if (error) {
      showToast(error.message, "error");
      setDeletingReviewId(null);
      return;
    }
  
    showToast("Recensione eliminata correttamente.");
    await loadReviews();
    setDeletingReviewId(null);
  };

  const averageRating =
  reviews.length > 0
    ? reviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0
      ) / reviews.length
    : 0;

const fiveStarReviewsCount = reviews.filter(
  (review) => review.rating === 5
).length;

const filteredReviews = reviews.filter((review) => {
  const searchableText = `
    ${review.title || ""}
    ${review.content || ""}
    ${review.companies?.name || ""}
    ${review.profiles?.full_name || ""}
  `.toLowerCase();

  const matchesSearch = searchableText.includes(
    search.toLowerCase().trim()
  );

  const matchesRating =
    ratingFilter === "all"
      ? true
      : review.rating === Number(ratingFilter);

  return matchesSearch && matchesRating;
});

if (loading) {
  return <Loading text="Caricamento recensioni..." />;
}

  if (!isAdmin) {
    return (
      <main className="min-h-screen p-10">
        Accesso negato.
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
          Moderazione
        </span>

        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          Recensioni EdilRate
        </span>
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
        Recensioni pubblicate
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Controlla le esperienze condivise dagli utenti e rimuovi eventuali
        contenuti non conformi.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-3 lg:min-w-[390px]">
      <div className="rounded-3xl border bg-gray-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {reviews.length}
        </p>

        <p className="mt-1 text-xs font-medium text-gray-600">
          Totali
        </p>
      </div>

      <div className="rounded-3xl border bg-yellow-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {averageRating.toFixed(1)}
        </p>

        <p className="mt-1 text-xs font-medium text-yellow-700">
          Media
        </p>
      </div>

      <div className="rounded-3xl border bg-green-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {fiveStarReviewsCount}
        </p>

        <p className="mt-1 text-xs font-medium text-green-700">
          5 stelle
        </p>
      </div>
    </div>
  </div>
</div>

<div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm md:p-6">
  <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-end">
    <div>
      <label
        htmlFor="admin-reviews-search"
        className="text-sm font-medium text-black"
      >
        Cerca recensioni
      </label>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔎
        </span>

        <input
          id="admin-reviews-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Titolo, contenuto, azienda o autore..."
          className="w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
        />
      </div>
    </div>

    <div>
      <label
        htmlFor="admin-reviews-rating"
        className="text-sm font-medium text-black"
      >
        Valutazione
      </label>

      <select
        id="admin-reviews-rating"
        value={ratingFilter}
        onChange={(event) =>
          setRatingFilter(
            event.target.value as
              | "all"
              | "5"
              | "4"
              | "3"
              | "2"
              | "1"
          )
        }
        className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      >
        <option value="all">Tutte le valutazioni</option>
        <option value="5">5 stelle</option>
        <option value="4">4 stelle</option>
        <option value="3">3 stelle</option>
        <option value="2">2 stelle</option>
        <option value="1">1 stella</option>
      </select>
    </div>
  </div>
</div>

<div className="mt-8">
  <div className="mb-5">
    <p className="text-sm font-medium text-gray-500">
      Risultati
    </p>

    <p className="mt-1 text-lg font-semibold text-black">
      {filteredReviews.length}{" "}
      {filteredReviews.length === 1
        ? "recensione trovata"
        : "recensioni trovate"}
    </p>
  </div>

  <div className="space-y-5">
    {filteredReviews.length > 0 ? (
      filteredReviews.map((review) => (
        <article
          key={review.id}
          className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="p-6 md:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xl text-yellow-400">
                    {"★".repeat(review.rating)}
                    <span className="text-gray-200">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    {review.rating}{" "}
                    {review.rating === 1 ? "stella" : "stelle"}
                  </span>

                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString(
                      "it-IT",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-black">
                  {review.title || "Recensione senza titolo"}
                </h2>

                <div className="mt-4 rounded-2xl bg-gray-50 p-5">
                  <p className="whitespace-pre-wrap leading-7 text-gray-700">
                    “{review.content || "Nessun contenuto disponibile."}”
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
                  <span>
                    👤{" "}
                    <span className="font-medium text-black">
                      {review.profiles?.full_name ||
                        "Utente EdilRate"}
                    </span>
                  </span>

                  <span>
                    🏢{" "}
                    {review.companies?.slug ? (
                      <a
                        href={`/imprese/${review.companies.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-black transition hover:opacity-60"
                      >
                        {review.companies?.name ||
                          "Azienda non trovata"}{" "}
                        ↗
                      </a>
                    ) : (
                      <span className="font-medium text-black">
                        {review.companies?.name ||
                          "Azienda non trovata"}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="w-full shrink-0 lg:w-auto">
                <Button
                  variant="danger"
                  onClick={() => deleteReview(review.id)}
                  disabled={deletingReviewId === review.id}
                  className="w-full lg:min-w-[150px]"
                >
                  {deletingReviewId === review.id
                    ? "Eliminazione..."
                    : "Elimina"}
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))
    ) : search || ratingFilter !== "all" ? (
      <div className="rounded-3xl border bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          🔎
        </div>

        <h2 className="mt-5 text-xl font-semibold text-black">
          Nessuna recensione trovata
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Modifica la ricerca oppure rimuovi il filtro applicato.
        </p>

        <Button
          variant="secondary"
          onClick={() => {
            setSearch("");
            setRatingFilter("all");
          }}
          className="mt-6"
        >
          Azzera filtri
        </Button>
      </div>
    ) : (
      <EmptyState
        emoji="⭐"
        title="Nessuna recensione"
        description="Quando gli utenti pubblicheranno recensioni compariranno qui."
      />
    )}
  </div>
</div>
      </section>
    </main>
  );
}