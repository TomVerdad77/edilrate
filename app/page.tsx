
"use client";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

const featuredCompanies = [
  {
    name: "Edil Trieste SRL",
    category: "Ristrutturazioni",
    city: "Trieste",
    rating: 4.8,
  },
  {
    name: "Rossi Costruzioni",
    category: "Muratori",
    city: "Muggia",
    rating: 4.6,
  },
  {
    name: "Adriatica Impianti",
    category: "Elettricisti",
    city: "Monfalcone",
    rating: 4.9,
  },
];

const categories = [
  "Ristrutturazioni",
  "Muratori",
  "Idraulici",
  "Elettricisti",
  "Serramenti",
  "Imbianchini",
];

export default function Home() { 
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [featuredCompanies, setFeaturedCompanies] = useState<any[]>([]);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
    loadFeaturedCompanies();
  }, []);   
  const loadFeaturedCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("id, name, slug, city, province, category, description, average_rating, review_count, verified")
      .order("created_at", { ascending: false })
      .limit(3);
  
    if (error) {
      console.log(error.message);
      return;
    }
  
    setFeaturedCompanies(data || []);
  };
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });
  };

  const loginWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });
  };

  const handleSearch = () => {
    if (!search.trim()) {
      window.location.href = "/imprese";
      return;
    }

    window.location.href = `/imprese?search=${encodeURIComponent(search.trim())}`;
  };
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  return (
    <main className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
  <a href="/" className="flex items-center">
  <img
  src="/logo-edilrate.png"
  alt="EdilRate"
  className="h-16 w-auto object-contain"
/>
</a>

    <nav className="hidden md:flex gap-8 text-sm text-gray-600">
      <a href="/" className="hover:text-black transition">Home</a>
      <a href="/imprese" className="hover:text-black transition">Imprese</a>
      <a href="/imprese" className="hover:text-black transition">Categorie</a>
      <a href="/chi-siamo" className="hover:text-black transition">Chi siamo</a>
    </nav>

    <div className="flex gap-3 items-center">
      {user ? (
        <>
          <span className="hidden md:block text-sm text-gray-600">
            Ciao, {user.user_metadata?.full_name}
          </span>

          <a
            href="/dashboard"
            className="px-4 py-2 text-sm bg-black text-white rounded-xl"
          >
            Dashboard
          </a>

          <button
            onClick={logout}
            className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-100 transition"
          >
            Esci
          </button>
        </>
      ) : (
        <>
         <button
  onClick={loginWithGoogle}
  className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-100 transition"
>
  Google
</button>

<button
  onClick={loginWithFacebook}
  className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-100 transition"
>
  Facebook
</button>

          <button className="hidden md:block px-4 py-2 text-sm bg-black text-white rounded-xl hover:bg-gray-800 transition">
            Registra impresa
          </button>
        </>
      )}
    </div>
  </div>
</header>

      {/* HERO */}
<section className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

  <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
    <div className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm bg-white shadow-sm">
      ⭐ Piattaforma edilizia del Friuli Venezia Giulia
    </div>

    <h1 className="mt-8 text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight">
      Trova l’impresa edile
      <br />
      perfetta per il tuo progetto
    </h1>

    <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
      Recensioni reali, aziende verificate e richieste preventivo
      in un’unica piattaforma moderna e trasparente.
    </p>

    <div className="mt-12 max-w-4xl mx-auto">
      <div className="bg-white border shadow-xl rounded-3xl p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
        <input
          type="text"
          placeholder="Cerca impresa, categoria o città..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-5 py-4 outline-none text-base md:text-lg rounded-2xl"
        />

        <button
          onClick={handleSearch}
          className="bg-black hover:bg-gray-800 transition text-white px-8 md:px-10 py-4 rounded-2xl text-base md:text-lg font-medium"
        >
          Cerca
        </button>
      </div>
    </div>

    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-gray-500">
      <div>✅ Aziende verificate</div>
      <div>⭐ Recensioni reali</div>
      <div>📍 Focus Friuli Venezia Giulia</div>
    </div>
  </div>
</section>

{/* STATS */}
<section className="max-w-7xl mx-auto px-6 pb-24">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <div className="border rounded-3xl p-8 text-center bg-white shadow-sm">
      <div className="text-4xl font-bold">
        200+
      </div>

      <p className="mt-3 text-gray-600">
        Aziende presenti
      </p>
    </div>

    <div className="border rounded-3xl p-8 text-center bg-white shadow-sm">
      <div className="text-4xl font-bold">
        4
      </div>

      <p className="mt-3 text-gray-600">
        Province coperte
      </p>
    </div>

    <div className="border rounded-3xl p-8 text-center bg-white shadow-sm">
      <div className="text-4xl font-bold">
        FVG
      </div>

      <p className="mt-3 text-gray-600">
        Focus regionale
      </p>
    </div>

    <div className="border rounded-3xl p-8 text-center bg-white shadow-sm">
      <div className="text-4xl font-bold">
        100%
      </div>

      <p className="mt-3 text-gray-600">
        Gratuito per iniziare
      </p>
    </div>
  </div>
</section>

{/* COME FUNZIONA */}
<section className="max-w-7xl mx-auto px-6 pb-24">
  <div className="text-center">
    <h2 className="text-4xl font-bold">
      Come funziona
    </h2>

    <p className="mt-4 text-gray-600">
      Trova l'impresa giusta in pochi minuti.
    </p>
  </div>

  <div className="mt-14 grid md:grid-cols-3 gap-6">
    <div className="border rounded-3xl p-8">
      <div className="text-4xl">🔍</div>

      <h3 className="mt-6 text-xl font-semibold">
        Cerca un'impresa
      </h3>

      <p className="mt-3 text-gray-600">
        Cerca per città, categoria o servizio.
      </p>
    </div>

    <div className="border rounded-3xl p-8">
      <div className="text-4xl">⭐</div>

      <h3 className="mt-6 text-xl font-semibold">
        Confronta le aziende
      </h3>

      <p className="mt-3 text-gray-600">
        Consulta profili, recensioni e informazioni utili.
      </p>
    </div>

    <div className="border rounded-3xl p-8">
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Categorie popolari
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="border rounded-2xl p-6 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="font-medium text-center">
                {category}
              </h3>
            </div>
          ))}
        </div>
      </section>

{/* HOW IT WORKS */}
<section className="max-w-7xl mx-auto px-6 pb-28">
  <div className="text-center max-w-3xl mx-auto">
    <h2 className="text-4xl font-bold">
      Come funziona EdilRate
    </h2>

    <p className="mt-4 text-gray-600 text-lg">
      Ti aiutiamo a trovare imprese affidabili e a richiedere preventivi
      in modo semplice, veloce e trasparente.
    </p>
  </div>

  <div className="mt-14 grid md:grid-cols-3 gap-8">
    <div className="border rounded-3xl p-8 bg-white shadow-sm">
      <div className="text-4xl">🔍</div>

      <h3 className="mt-6 text-2xl font-semibold">
        Cerca l’impresa
      </h3>

      <p className="mt-4 text-gray-600 leading-7">
        Filtra per città, categoria o tipo di lavoro e trova le imprese
        più adatte al tuo progetto.
      </p>
    </div>

    <div className="border rounded-3xl p-8 bg-white shadow-sm">
      <div className="text-4xl">⭐</div>

      <h3 className="mt-6 text-2xl font-semibold">
        Leggi le recensioni
      </h3>

      <p className="mt-4 text-gray-600 leading-7">
        Consulta esperienze reali di altri utenti prima di scegliere a chi
        affidare il tuo lavoro.
      </p>
    </div>

    <div className="border rounded-3xl p-8 bg-white shadow-sm">
      <div className="text-4xl">📩</div>

      <h3 className="mt-6 text-2xl font-semibold">
        Richiedi un preventivo
      </h3>

      <p className="mt-4 text-gray-600 leading-7">
        Invia una richiesta direttamente all’impresa e ricevi un contatto
        per valutare il lavoro.
      </p>
    </div>
  </div>
</section>

      {/* FEATURED COMPANIES */}
<section className="max-w-7xl mx-auto px-6 pb-28">
  <div className="flex items-center justify-between gap-6 mb-10">
    <div>
      <h2 className="text-4xl font-bold">
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

  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
    {featuredCompanies.map((company) => (
      <div
        key={company.id}
        className="group border rounded-3xl md:rounded-[28px] overflow-hidden hover:shadow-2xl transition duration-300 bg-white flex flex-col"
      >
        <div className="h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-500">
          EdilRate
        </div>

        <div className="p-5 md:p-7 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                {company.name}
              </h3>

              <p className="mt-2 text-gray-600">
                {company.category || "Categoria non indicata"}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                📍 {company.city || "Città non indicata"} · {company.province || "FVG"}
              </p>
            </div>

            {company.verified && (
              <div className="border rounded-full px-3 py-1 text-xs">
                Verificata
              </div>
            )}
          </div>

          {company.description && (
            <p className="mt-4 text-sm text-gray-500 line-clamp-2">
              {company.description}
            </p>
          )}

          <p className="mt-5 text-sm text-gray-500">
            ⭐ {company.average_rating ?? 0} · {company.review_count ?? 0} recensioni
          </p>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`/imprese/${company.slug}`}
              className="flex-1 border py-3 rounded-2xl hover:bg-gray-100 transition text-center"
            >
              Profilo
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
      <Footer />
    </main>
  );
}
