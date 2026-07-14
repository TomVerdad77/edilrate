"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type Company = {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  province: string;
  description: string | null;
  average_rating: number | null;
  review_count: number | null;
  verified: boolean;
  cover_image_url?: string | null;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [sortBy, setSortBy] = useState<
  "reviews" | "rating" | "name"
>("reviews");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  
    const initialSearch = params.get("search");
    const initialCategory = params.get("category");
  
    if (initialSearch) {
      setSearch(initialSearch);
    }
  
    if (initialCategory) {
      setCategory(initialCategory);
    }
  
    loadCompanies();
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

  const loadCompanies = async () => {
    setLoading(true);
  
    const { data: companiesData, error: companiesError } = await supabase
      .from("companies")
      .select(
        "id, name, slug, category, city, province, description, average_rating, review_count, verified"
      )
      .order("created_at", { ascending: false });
  
    if (companiesError) {
      showToast(companiesError.message, "error");
      setLoading(false);
      return;
    }
  
    const companyIds = (companiesData || []).map((company) => company.id);
  
    let coverImages: {
      company_id: string;
      image_url: string;
    }[] = [];
  
    if (companyIds.length > 0) {
      const { data: coverData, error: coverError } = await supabase
        .from("company_images")
        .select("company_id, image_url")
        .in("company_id", companyIds)
        .eq("is_cover", true);
  
      if (coverError) {
        showToast(coverError.message, "error");
      } else {
        coverImages = coverData || [];
      }
    }
  
    const companiesWithCover = (companiesData || []).map((company) => {
      const cover = coverImages.find(
        (image) => image.company_id === company.id
      );
  
      return {
        ...company,
        cover_image_url: cover?.image_url || null,
      };
    });
  
    setCompanies(companiesWithCover);
    setLoading(false);
  };

  const filteredCompanies = companies.filter((company) => {
    const text = `${company.name} ${company.category} ${company.city} ${company.province} ${company.description}`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesCity = city
      ? company.city?.toLowerCase().includes(city.toLowerCase())
      : true;

      const matchesProvince = province
  ? company.province?.toLowerCase().trim() === province.toLowerCase().trim()
  : true;

  const matchesCategory = category
  ? company.category?.trim().toLowerCase() ===
    category.trim().toLowerCase()
  : true;

    return matchesSearch && matchesCity && matchesProvince && matchesCategory;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "rating") {
      const ratingDifference =
        (b.average_rating || 0) - (a.average_rating || 0);
  
      if (ratingDifference !== 0) {
        return ratingDifference;
      }
  
      return (b.review_count || 0) - (a.review_count || 0);
    }
  
    if (sortBy === "name") {
      return a.name.localeCompare(b.name, "it", {
        sensitivity: "base",
      });
    }
  
    return (b.review_count || 0) - (a.review_count || 0);
  });

  const availableCategories = Array.from(
  new Map(
    companies
      .map((company) => company.category?.trim())
      .filter(Boolean)
      .map((category) => [
        category.toLowerCase(),
        category,
      ])
  ).values()
).sort((a, b) =>
  a.localeCompare(b, "it", {
    sensitivity: "base",
  })
);

const availableCities = Array.from(
  new Set(
    companies
      .map((company) => company.city)
      .filter(Boolean)
  )
).sort((a, b) =>
  a.localeCompare(b, "it", {
    sensitivity: "base",
  })
);
  return (
    <main className="min-h-screen bg-white text-black">
  <Navbar />

  <Toast
    message={toastMessage}
    type={toastType}
    onClose={() => setToastMessage("")}
  />
      <section className="max-w-7xl mx-auto px-6 py-12">
      <div>
  <span className="inline-flex rounded-full border bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
    Directory EdilRate
  </span>

  <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
    Imprese edili
  </h1>

  <p className="mt-4 max-w-2xl leading-7 text-gray-600">
    Cerca e confronta imprese edili recensite in Friuli Venezia Giulia.
  </p>
</div>

        <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Ricerca imprese
      </p>

      <h2 className="mt-1 text-xl font-semibold text-black">
        Trova l’azienda giusta
      </h2>
    </div>

    {(search || city || province || category) && (
      <button
        type="button"
        onClick={() => {
          setSearch("");
          setCity("");
          setProvince("");
          setCategory("");

          window.history.replaceState(
            {},
            "",
            window.location.pathname
          );
        }}
        className="self-start rounded-full border px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-black hover:text-black sm:self-auto"
      >
        Azzera filtri
      </button>
    )}
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div className="md:col-span-2 xl:col-span-1">
      <label
        htmlFor="companies-search"
        className="text-sm font-medium text-black"
      >
        Ricerca
      </label>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔎
        </span>

        <input
          id="companies-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          placeholder="Nome, categoria o servizio"
        />
      </div>
    </div>

    <div>
      <label
        htmlFor="companies-city"
        className="text-sm font-medium text-black"
      >
        Città
      </label>

      <select
        id="companies-city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      >
        <option value="">Tutte le città</option>

        {availableCities.map((availableCity) => (
          <option
            key={availableCity}
            value={availableCity}
          >
            {availableCity}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label
        htmlFor="companies-province"
        className="text-sm font-medium text-black"
      >
        Provincia
      </label>

      <select
        id="companies-province"
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      >
        <option value="">Tutte le province</option>
        <option value="Trieste">Trieste</option>
        <option value="Udine">Udine</option>
        <option value="Gorizia">Gorizia</option>
        <option value="Pordenone">Pordenone</option>
      </select>
    </div>

    <div>
      <label
        htmlFor="companies-category"
        className="text-sm font-medium text-black"
      >
        Categoria
      </label>

      <select
        id="companies-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      >
        <option value="">Tutte le categorie</option>

        {availableCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

        <div className="mt-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-sm font-medium text-gray-500">
      Risultati della ricerca
    </p>

    <p className="mt-1 text-lg font-semibold text-black">
      {loading
        ? "Caricamento aziende..."
        : `${filteredCompanies.length} ${
            filteredCompanies.length === 1
              ? "azienda trovata"
              : "aziende trovate"
          }`}
    </p>
  </div>

  <div className="w-full sm:w-auto">
    <label
      htmlFor="companies-sort"
      className="mb-2 block text-sm font-medium text-black"
    >
      Ordina per
    </label>

    <select
      id="companies-sort"
      value={sortBy}
      onChange={(e) =>
        setSortBy(
          e.target.value as "reviews" | "rating" | "name"
        )
      }
      className="w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5 sm:min-w-[220px]"
    >
      <option value="reviews">
        Più recensite
      </option>

      <option value="rating">
        Valutazione migliore
      </option>

      <option value="name">
        Nome A–Z
      </option>
    </select>
  </div>
</div>

  {loading ? (
    <div className="grid gap-6">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border bg-white p-6 shadow-sm"
        >
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="mt-4 h-8 w-2/3 rounded bg-gray-200" />
          <div className="mt-4 h-4 w-1/2 rounded bg-gray-200" />
          <div className="mt-6 h-16 rounded-2xl bg-gray-100" />
        </div>
      ))}
    </div>
  ) : filteredCompanies.length > 0 ? (
    <div className="grid gap-6">
      {sortedCompanies.map((company) => (
        <article
          key={company.id}
          className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="grid md:grid-cols-[180px_1fr]">
          <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 md:min-h-full">
  {company.cover_image_url ? (
    <img
      src={company.cover_image_url}
      alt={`Foto di copertina di ${company.name}`}
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full min-h-[220px] items-center justify-center">
      <div className="text-center">
        <div className="text-5xl">
          🏗️
        </div>

        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500">
  Foto non disponibile
</p>
      </div>
    </div>
  )}

  {company.cover_image_url && (
    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
  )}
</div>

            <div className="p-6 md:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    {company.category && (
                      <span className="rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700">
                      {company.category}
                    </span>
                    )}

                    {company.verified && (
                      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                        ✓ Impresa verificata
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-black md:text-3xl">
                    {company.name}
                  </h2>

                  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                    <span>📍 {company.city || "Città non indicata"}</span>

                    {company.province && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{company.province}</span>
                      </>
                    )}
                  </p>

                  {company.description && (
                    <p className="mt-4 line-clamp-2 max-w-2xl leading-7 text-gray-600">
                      {company.description}
                    </p>
                  )}

<div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
  <div className="flex items-center text-lg">
    <span className="text-yellow-400">
      {"★".repeat(
        Math.max(
          0,
          Math.min(5, Math.round(company.average_rating || 0))
        )
      )}
    </span>

    <span className="text-gray-200">
      {"★".repeat(
        5 -
          Math.max(
            0,
            Math.min(5, Math.round(company.average_rating || 0))
          )
      )}
    </span>
  </div>

  <span className="font-semibold text-black">
    {company.average_rating?.toFixed(1) ?? "0.0"}
  </span>

  <span className="text-sm text-gray-500">
    {company.review_count ?? 0}{" "}
    {(company.review_count ?? 0) === 1
      ? "recensione"
      : "recensioni"}
  </span>
</div>
                </div>

                <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
  <Button
    href={`/imprese/${company.slug}#preventivo`}
    className="w-full lg:min-w-[190px]"
  >
    Richiedi preventivo
  </Button>

  <Button
    href={`/imprese/${company.slug}`}
    variant="secondary"
    className="w-full lg:min-w-[190px]"
  >
    Vedi profilo
  </Button>
</div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <div className="rounded-3xl border bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
        🔎
      </div>

      <h2 className="mt-5 text-xl font-semibold text-black">
        Nessuna impresa trovata
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Prova a modificare la ricerca oppure rimuovi uno o più filtri.
      </p>

      <Button
        variant="secondary"
        onClick={() => {
          setSearch("");
          setCity("");
          setProvince("");
          setCategory("");
        }}
        className="mt-6"
      >
        Azzera tutti i filtri
      </Button>
    </div>
  )}
</div>
      </section>
      <Footer />
    </main>
  );
}