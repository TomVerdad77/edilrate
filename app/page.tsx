"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type PopularCategory = {
  name: string;
  count: number;
};

type RatingDistributionItem = {
  star: number;
  count: number;
  percentage: number;
};

function getRatingDistribution(ratings: number[]): RatingDistributionItem[] {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const rating of ratings) {
    if (rating >= 1 && rating <= 5) {
      counts[rating]++;
    }
  }

  const total = ratings.length;

  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percentage: total > 0 ? (counts[star] / total) * 100 : 0,
  }));
}

export default function Home() { 
  const [search, setSearch] = useState("");
  const [featuredCompanies, setFeaturedCompanies] = useState<any[]>([]);
  const [companiesCount, setCompaniesCount] = useState(0);
const [reviewsCount, setReviewsCount] = useState(0);
const [quotesCount, setQuotesCount] = useState(0);
const [claimedCount, setClaimedCount] = useState(0);

const [popularCategories, setPopularCategories] = useState<
  PopularCategory[]
>([]);

const loadPopularCategories = async () => {
  const { data, error } = await supabase
    .from("companies")
    .select("category");

  if (error) {
    console.error("Errore caricamento categorie:", error.message);
    return;
  }

  const categoryMap = new Map<
    string,
    PopularCategory
  >();

  for (const company of data || []) {
    const category = company.category?.trim();

    if (!category) continue;

    const normalizedCategory = category.toLowerCase();
    const existingCategory =
      categoryMap.get(normalizedCategory);

    if (existingCategory) {
      existingCategory.count += 1;
    } else {
      categoryMap.set(normalizedCategory, {
        name: category,
        count: 1,
      });
    }
  }

  const sortedCategories = Array.from(
    categoryMap.values()
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  setPopularCategories(sortedCategories);
};

const [stats, setStats] = useState({
  companies: 0,
  reviews: 0,
  cities: 0,
});
useEffect(() => {
  loadFeaturedCompanies();
  loadStats();
  loadPopularCategories();
}, []);
  
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

    const { count: claimed } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })
      .eq("claimed", true);

    setCompaniesCount(companies || 0);
    setReviewsCount(reviews || 0);
    setQuotesCount(quotes || 0);
    setClaimedCount(claimed || 0);
  };
  
  const loadFeaturedCompanies = async () => {
    const { data, error } = await supabase
  .from("companies")
  .select(`
  id,
  name,
  slug,
  city,
  province,
  category,
  description,
  average_rating,
  review_count,
  verified,
  claimed,
  company_images (
  image_url,
  is_cover,
  created_at
)
`)
  .order("claimed", { ascending: false })
  .order("average_rating", { ascending: false })
  .order("review_count", { ascending: false })
  .limit(3);

    const { count: companiesCount } = await supabase
    .from("companies")
    .select("*", { count: "exact", head: true });
  
  const { count: reviewsCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });
  
  const { data: citiesData } = await supabase
    .from("companies")
    .select("city");
  
  const uniqueCities = new Set(
    (citiesData || [])
      .map((c) => c.city)
      .filter(Boolean)
  );
  
  setStats({
    companies: companiesCount || 0,
    reviews: reviewsCount || 0,
    cities: uniqueCities.size,
  });

    const companies = data || [];

    if (companies.length === 0) {
      setFeaturedCompanies([]);
      return;
    }

    const companyIds = companies.map((company) => company.id);
    const { data: reviews } = await supabase
      .from("reviews")
      .select("company_id, rating")
      .in("company_id", companyIds);

    const ratingsByCompany = new Map<string, number[]>();

    for (const review of reviews || []) {
      const existing = ratingsByCompany.get(review.company_id) || [];
      existing.push(review.rating);
      ratingsByCompany.set(review.company_id, existing);
    }

    setFeaturedCompanies(
      companies.map((company) => ({
        ...company,
        ratingDistribution: getRatingDistribution(
          ratingsByCompany.get(company.id) || []
        ),
      }))
    );
  };

  const handleSearch = () => {
    if (!search.trim()) {
      window.location.href = "/imprese";
      return;
    }

    window.location.href = `/imprese?search=${encodeURIComponent(search.trim())}`;
  };

  return (
    <main className="min-h-screen bg-white text-black">
    <Navbar />

      {/* HERO */}
<section className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

  <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
    <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border bg-white px-4 py-2 text-center text-sm shadow-sm">
      ⭐ Piattaforma edilizia del Friuli Venezia Giulia
    </div>

    <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-7xl">
      Trova l’impresa edile
      <br />
      perfetta per il tuo progetto
    </h1>

    <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
      Recensioni reali, aziende verificate e richieste preventivo
      in un’unica piattaforma moderna e trasparente.
    </p>

    <div className="mt-12 max-w-4xl mx-auto">
      <div className="flex flex-col gap-3 rounded-3xl border bg-white p-3 shadow-xl md:flex-row md:gap-4">
        <input
          type="text"
          placeholder="Cerca impresa, categoria o città..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full flex-1 rounded-2xl px-4 py-4 text-base outline-none md:px-5 md:text-lg"
        />

        <button
          onClick={handleSearch}
          className="w-full rounded-2xl bg-black px-8 py-4 text-base font-medium text-white transition hover:bg-gray-800 md:w-auto md:px-10 md:text-lg"
        >
          Cerca
        </button>
      </div>
    </div>
    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">

<div className="rounded-3xl border bg-white p-6 text-center shadow-sm md:p-8">
  <div className="text-4xl">🏢</div>

  <p className="mt-4 text-4xl font-bold">
    {stats.companies}
  </p>

  <p className="mt-2 text-gray-500">
    Imprese registrate
  </p>
</div>

<div className="rounded-3xl border bg-white p-6 text-center shadow-sm md:p-8">
  <div className="text-4xl">⭐</div>

  <p className="mt-4 text-4xl font-bold">
    {stats.reviews}
  </p>

  <p className="mt-2 text-gray-500">
    Recensioni pubblicate
  </p>
</div>

<div className="rounded-3xl border bg-white p-6 text-center shadow-sm md:p-8">
  <div className="text-4xl">📍</div>

  <p className="mt-4 text-4xl font-bold">
    {stats.cities}
  </p>

  <p className="mt-2 text-gray-500">
    Città coperte
  </p>
</div>

</div>

<div className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3 md:mt-12">
      <div>✅ Aziende verificate</div>
      <div>⭐ Recensioni reali</div>
      <div>📍 Focus Friuli Venezia Giulia</div>
    </div>
  </div>
</section>



{/* COME FUNZIONA */}
<section className="max-w-7xl mx-auto px-6 pb-24">
  <div className="text-center">
  <h2 className="text-3xl font-bold md:text-4xl">
    Come funziona
    </h2>

    <p className="mt-4 text-gray-600">
      Trova l'impresa giusta in pochi minuti.
    </p>
  </div>

  <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
    <div className="rounded-3xl border bg-white p-6 text-center shadow-sm md:p-8">
      <div className="text-4xl">🔍</div>

      <h3 className="mt-6 text-xl font-semibold">
        Cerca un'impresa
      </h3>

      <p className="mt-3 text-gray-600">
        Cerca per città, categoria o servizio.
      </p>
    </div>

    <div className="rounded-3xl border bg-white p-6 text-center shadow-sm md:p-8">
      <div className="text-4xl">⭐</div>

      <h3 className="mt-6 text-xl font-semibold">
        Leggi le opinioni
      </h3>

      <p className="mt-3 text-gray-600">
        Consulta profili, recensioni e informazioni utili.
      </p>
    </div>

    <div className="rounded-3xl border bg-white p-6 text-center shadow-sm md:p-8">
      <div className="text-4xl">📩</div>

      <h3 className="mt-6 text-xl font-semibold">
        Richiedi un preventivo
      </h3>

      <p className="mt-3 text-gray-600">
        Contatta direttamente l'impresa più adatta al tuo progetto.
      </p>
    </div>
  </div>
</section>

      {/* CATEGORIES */}
<section className="max-w-7xl mx-auto px-6 pb-20">
  <div className="mb-8 flex items-center justify-between">
    <h2 className="text-3xl font-bold">
      Categorie popolari
    </h2>

    <a
      href="/categorie"
      className="text-sm font-medium text-gray-600 transition hover:text-black"
    >
      Vedi tutte →
    </a>
  </div>

  {popularCategories.length > 0 ? (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {popularCategories.map((category) => (
        <a
          key={category.name}
          href={`/imprese?category=${encodeURIComponent(
            category.name
          )}`}
          className="group flex min-h-[110px] flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-lg sm:p-6"
        >
          <h3 className="font-medium">
            {category.name}
          </h3>

          <p className="mt-2 text-xs text-gray-500">
            {category.count}{" "}
            {category.count === 1
              ? "impresa"
              : "imprese"}
          </p>
        </a>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border bg-gray-50 p-8 text-center text-gray-600">
      Nessuna categoria disponibile.
    </div>
  )}
</section>

      {/* FEATURED COMPANIES */}
<section className="max-w-7xl mx-auto px-6 pb-28">
  <div className="flex items-center justify-between gap-6 mb-10">
    <div>
      <h2 className="text-3xl font-bold md:text-4xl">
        Aziende in evidenza
      </h2>

      <p className="mt-3 text-gray-600">
        Alcune imprese già presenti su EdilRate.
      </p>
    </div>

    <a
      href="/imprese"
      className="hidden md:block border px-5 py-3 rounded-2xl hover:bg-gray-100 transition"
    >
      Vedi tutte
    </a>
  </div>

  <div className="grid gap-6 md:grid-cols-3 md:gap-8">
    {featuredCompanies.map((company) => (
      <div
  key={company.id}
  className="group border rounded-[32px] overflow-hidden hover:shadow-2xl transition duration-300 bg-white flex flex-col"
>
<div className="h-48 bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden">
  {company.company_images?.find((image: any) => image.is_cover)?.image_url ||
company.company_images?.[0]?.image_url ? (
    <img
      src={
  company.company_images?.find((image: any) => image.is_cover)?.image_url ||
  company.company_images?.[0]?.image_url
}
      alt={company.name}
      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
    />
  ) : (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl">🏗️</div>
        <p className="mt-3 text-sm text-gray-500">EdilRate</p>
      </div>
    </div>
  )}
</div>

  <div className="p-6 md:p-7 flex flex-col flex-1">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-2xl font-semibold leading-tight">
          {company.name}
        </h3>

        <div className="mt-3">
  <span className="inline-flex bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
    {company.category || "Categoria non indicata"}
  </span>
</div>

        <p className="mt-1 text-sm text-gray-500">
          📍 {company.city || "Città non indicata"} · {company.province || "FVG"}
        </p>
      </div>

      {company.verified && (
        <span className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium">
          🛡️ Verificata
        </span>
      )}
    </div>

    <div className="mt-5 flex items-center gap-3">
  <div className="flex items-center text-yellow-400 text-lg">
    {"★".repeat(Math.round(company.average_rating || 0))}
    <span className="text-gray-300">
      {"★".repeat(5 - Math.round(company.average_rating || 0))}
    </span>
  </div>

  <div className="text-sm text-gray-600">
    <span className="font-semibold text-black">
      {company.average_rating?.toFixed?.(1) ?? "0.0"}
    </span>{" "}
    ({company.review_count ?? 0})
  </div>
</div>

    {company.claimed && (
      <div className="mt-4">
        <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium">
          Profilo rivendicato
        </span>
      </div>
    )}

    {company.description && (
      <p className="mt-5 text-sm text-gray-500 line-clamp-2">
        {company.description}
      </p>
    )}

    <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
      <a
        href={`/imprese/${company.slug}`}
        className="flex-1 border py-3 rounded-2xl hover:bg-gray-100 transition text-center"
      >
        Vedi profilo
      </a>

      <a
        href={`/imprese/${company.slug}#preventivo`}
        className="flex-1 bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition text-center"
      >
        Preventivo
      </a>
    </div>
  </div>
</div>
    ))}
  </div>
</section>
{/* FINAL CTA */}
<section className="max-w-7xl mx-auto px-6 pb-28">
<div className="rounded-[32px] bg-black p-8 text-center text-white md:p-16">
    <h2 className="text-3xl font-bold leading-tight md:text-5xl">
      Trova l’impresa giusta per il tuo prossimo progetto.
    </h2>

    <p className="mt-5 text-gray-300 max-w-2xl mx-auto">
      Esplora le aziende presenti su EdilRate oppure registra la tua impresa
      per iniziare a ricevere richieste.
    </p>

    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/imprese"
        className="bg-white text-black px-6 py-4 rounded-2xl font-medium"
      >
        Cerca un’impresa
      </a>

      <a
        href="/auth/register"
        className="border border-white/30 px-6 py-4 rounded-2xl font-medium hover:bg-white/10 transition"
      >
        Registra la tua azienda
      </a>
    </div>
  </div>
</section>
      <Footer />
    </main>
  );
}
