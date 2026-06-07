"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search");
  
    if (initialSearch) {
      setSearch(initialSearch);
    }
  
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("id, name, slug, category, city, average_rating, review_count, verified")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setCompanies(data || []);
  };

  const filteredCompanies = companies.filter((company) => {
    const text = `${company.name} ${company.category} ${company.city}`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesCity = city
      ? company.city?.toLowerCase().includes(city.toLowerCase())
      : true;
    const matchesCategory = category
      ? company.category === category
      : true;

    return matchesSearch && matchesCity && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Imprese edili</h1>

        <p className="mt-3 text-gray-600">
          Trova imprese edili recensite in Friuli Venezia Giulia.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3"
            placeholder="Cerca impresa, categoria o città..."
          />

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-xl px-4 py-3"
            placeholder="Città"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="">Tutte le categorie</option>
            <option value="Ristrutturazioni">Ristrutturazioni</option>
            <option value="Muratori">Muratori</option>
            <option value="Idraulici">Idraulici</option>
            <option value="Elettricisti">Elettricisti</option>
            <option value="Serramenti">Serramenti</option>
            <option value="Imbianchini">Imbianchini</option>
          </select>
        </div>

        <div className="mt-10 grid gap-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="border rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">{company.name}</h2>

                    {company.verified && (
                      <span className="text-xs border px-2 py-1 rounded-full">
                        Verificata
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-gray-600">
                    {company.category} · {company.city}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    ⭐ {company.average_rating ?? 0} ·{" "}
                    {company.review_count ?? 0} recensioni
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`/imprese/${company.slug}`}
                    className="px-5 py-3 border rounded-xl"
                  >
                    Vedi profilo
                  </a>

                  <a
                    href={`/imprese/${company.slug}#preventivo`}
                    className="px-5 py-3 bg-black text-white rounded-xl"
                  >
                    Richiedi preventivo
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="border rounded-3xl p-6 text-gray-600">
              Nessuna impresa trovata.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}