"use client";

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
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");

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
      .select("id, name, slug, category, city, province, description, average_rating, review_count, verified")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setCompanies(data || []);
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
  ? company.category?.toLowerCase().trim() === category.toLowerCase().trim()
  : true;

    return matchesSearch && matchesCity && matchesProvince && matchesCategory;
  });

  const sortedCompanies = [...filteredCompanies].sort(
    (a, b) => (b.review_count || 0) - (a.review_count || 0)
  );
const availableCategories = Array.from(
  new Set(companies.map((company) => company.category).filter(Boolean))
);
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Imprese edili</h1>

        <p className="mt-3 text-gray-600">
          Trova imprese edili recensite in Friuli Venezia Giulia.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-3"
            placeholder="Cerca azienda, categoria o servizio..."         />

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded-xl px-4 py-3"
            placeholder="Città"
          />
<select
  value={province}
  onChange={(e) => setProvince(e.target.value)}
  className="border rounded-xl px-4 py-3"
>
  <option value="">Tutte le province</option>
  <option value="Trieste">Trieste</option>
  <option value="Udine">Udine</option>
  <option value="Gorizia">Gorizia</option>
  <option value="Pordenone">Pordenone</option>
</select>
<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border rounded-xl px-4 py-3"
>
  <option value="">Tutte le categorie</option>

  {availableCategories.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>
        </div>

        <div className="mt-10">
  <p className="text-gray-600 mb-6">
    {filteredCompanies.length} aziende trovate
  </p>

  <div className="grid gap-6">
          {filteredCompanies.length > 0 ? (
            sortedCompanies.map((company) => (             <div
                key={company.id}
                className="border rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-semibold">
                      {company.name}
                      </h2>

                    {company.verified && (
                      <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                        Verificata
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-gray-600">
                    {company.category} · {company.city} · {company.province}
                  </p>
                  {company.description && (
  <p className="mt-2 text-sm text-gray-500">
    {company.description}
  </p>
)}
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
        </div>
      </section>
    </main>
  );
}