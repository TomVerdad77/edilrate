"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";

type CategoryItem = {
  name: string;
  count: number;
};

const categoryIcons: Record<string, string> = {
  costruzioni: "🏗️",
  edilizia: "🧱",
  ristrutturazioni: "🏠",
  restauri: "🏛️",
  progettazione: "📐",
  "general contractor": "🏢",
  "impiantistica edile": "⚙️",
  "edilizia su funi": "🪢",
  lapideo: "🪨",
  muratori: "🧱",
  idraulici: "🚿",
  elettricisti: "⚡",
  serramenti: "🪟",
  imbianchini: "🎨",
};

const getCategoryIcon = (category: string) => {
  return categoryIcons[category.trim().toLowerCase()] || "🏗️";
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("companies")
      .select("category");

    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }

    const categoryMap = new Map<string, CategoryItem>();

    for (const company of data || []) {
      const category = company.category?.trim();

      if (!category) continue;

      const normalizedCategory = category.toLowerCase();
      const existingCategory = categoryMap.get(normalizedCategory);

      if (existingCategory) {
        existingCategory.count += 1;
      } else {
        categoryMap.set(normalizedCategory, {
          name: category,
          count: 1,
        });
      }
    }

    const sortedCategories = Array.from(categoryMap.values()).sort((a, b) => {
        // Prima le categorie con più aziende
        if (b.count !== a.count) {
          return b.count - a.count;
        }
      
        // Se hanno lo stesso numero, ordine alfabetico
        return a.name.localeCompare(b.name, "it", {
          sensitivity: "base",
        });
      });

    setCategories(sortedCategories);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
            Esplora per attività
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Categorie di imprese
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Seleziona il tipo di lavoro che ti interessa e scopri le imprese
            disponibili su EdilRate.
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-48 animate-pulse rounded-3xl border bg-gray-100"
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={`/imprese?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group flex min-h-[190px] flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-2
                hover:border-black
                hover:shadow-xl md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                      {getCategoryIcon(category.name)}
                    </div>

                    <span className="rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700">
                    {category.count}{" "}
                    {category.count === 1 ? "impresa" : "imprese"}
                    </span>
                  </div>

                  <div className="mt-8 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-black">
                        {category.name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        Visualizza le aziende
                      </p>
                    </div>

                    <span className="text-xl text-gray-400 transition group-hover:translate-x-2 group-hover:text-black">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border bg-gray-50 px-6 py-16 text-center">
              <div className="text-4xl">🏗️</div>

              <h2 className="mt-5 text-xl font-semibold">
                Nessuna categoria disponibile
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Le categorie delle imprese compariranno qui.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 rounded-[32px] bg-black p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-bold">
            Conosci già il nome dell’impresa?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Consulta direttamente l’elenco completo e utilizza ricerca, città,
            provincia e filtri avanzati.
          </p>

          <a
            href="/imprese"
            className="mt-7 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-gray-100"
          >
            Vedi tutte le imprese
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}