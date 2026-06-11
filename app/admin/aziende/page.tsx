"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AdminAziendePage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [newName, setNewName] = useState("");
const [newPhone, setNewPhone] = useState("");
const [newCity, setNewCity] = useState("");
const [newCategory, setNewCategory] = useState("");
const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replaceAll(" ", "-")
      .replace(/[^a-z0-9-]/g, "");
  };
  
  const createCompany = async () => {
    if (!newName.trim()) {
      alert("Inserisci il nome azienda.");
      return;
    }
  
    const { error } = await supabase.from("companies").insert({
      name: newName,
      slug: createSlug(newName),
      phone: newPhone,
      city: newCity,
      category: newCategory,
      description: newSubcategory,
      region: "Friuli Venezia Giulia",
      province: "TS",
      average_rating: 0,
      review_count: 0,
      verified: false,
      claimed: false,
    });
  
    if (error) {
      alert(error.message);
      return;
    }
  
    setNewName("");
    setNewPhone("");
    setNewCity("");
    setNewCategory("");
    setNewSubcategory("");
  
    loadCompanies();
  };

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

        <div className="mt-10 border rounded-3xl p-6">
  <h2 className="text-2xl font-semibold">Nuova azienda</h2>

  <div className="mt-6 grid md:grid-cols-2 gap-4">
    <input
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      placeholder="Nome azienda"
      className="border rounded-xl px-4 py-3"
    />

    <input
      value={newPhone}
      onChange={(e) => setNewPhone(e.target.value)}
      placeholder="Cellulare / telefono"
      className="border rounded-xl px-4 py-3"
    />

    <input
      value={newCity}
      onChange={(e) => setNewCity(e.target.value)}
      placeholder="Città"
      className="border rounded-xl px-4 py-3"
    />

    <input
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      placeholder="Categoria"
      className="border rounded-xl px-4 py-3"
    />

    <input
      value={newSubcategory}
      onChange={(e) => setNewSubcategory(e.target.value)}
      placeholder="Sottocategoria / attività principale"
      className="border rounded-xl px-4 py-3 md:col-span-2"
    />
  </div>

  <button
    onClick={createCompany}
    className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
  >
    Aggiungi azienda
  </button>
</div>

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