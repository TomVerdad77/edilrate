"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AdminAziendePage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setCompanies(data || []);
  };

  const filteredCompanies = companies.filter((company) => {
    const text = `${company.name} ${company.city} ${company.category}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Admin aziende</h1>

        <p className="mt-3 text-gray-600">
          Gestisci le aziende presenti su EdilRate.
        </p>

        <div className="mt-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca azienda, città o categoria..."
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        <div className="mt-10 space-y-4">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="border rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold">
                    {company.name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {company.category || "Categoria non indicata"} ·{" "}
                    {company.city || "Città non indicata"}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Slug: {company.slug}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {company.claimed ? "Profilo rivendicato" : "Non rivendicato"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`/imprese/${company.slug}`}
                    className="px-5 py-3 border rounded-xl"
                  >
                    Vedi profilo
                  </a>

                  <button className="px-5 py-3 bg-black text-white rounded-xl">
                    Modifica
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="border rounded-3xl p-6 text-gray-600">
              Nessuna azienda trovata.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}