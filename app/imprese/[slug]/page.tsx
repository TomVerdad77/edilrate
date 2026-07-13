"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function CompanyPage() {
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

const [quoteName, setQuoteName] = useState("");
const [quoteEmail, setQuoteEmail] = useState("");
const [quotePhone, setQuotePhone] = useState("");
const [quoteMessage, setQuoteMessage] = useState("");
const [quoteSent, setQuoteSent] = useState(false);
const [claimSent, setClaimSent] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState<"success" | "error">("success");

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const path = window.location.pathname;
    const slug = path.split("/").pop();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .single();

    setCompany(companyData);

    if (companyData) {
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq("company_id", companyData.id)
        .order("created_at", {
          ascending: false,
        });

      setReviews(reviewsData || []);
      const { data: imageData } = await supabase
  .from("company_images")
  .select("*")
  .eq("company_id", companyData.id)
  .order("is_cover", {
    ascending: false,
  })
  .order("created_at", {
    ascending: false,
  });

setImages(imageData || []);
    }
  };

  const submitClaimRequest = async () => {
    if (!user || !company) return;
  
    const { error } = await supabase.from("claim_requests").insert({
      company_id: company.id,
      user_id: user.id,
    });
  
    if (error) {
      showToast(error.message, "error");
      return;
    }
  
    setClaimSent(true);
    showToast(
      "Richiesta di rivendicazione inviata correttamente. Sarà verificata dal team EdilRate."
    );
  };

  const submitQuoteRequest = async () => {
    if (!company) return;
  
    if (!quoteName.trim() || !quoteEmail.trim() || !quoteMessage.trim()) {
      showToast(
        "Inserisci nome, email e una descrizione del lavoro richiesto.",
        "error"
      );
      return;
    }
  
    const { error } = await supabase.from("quote_requests").insert({
      company_id: company.id,
      customer_name: quoteName.trim(),
      customer_email: quoteEmail.trim(),
      customer_phone: quotePhone.trim(),
      message: quoteMessage.trim(),
      status: "pending",
    });
  
    if (error) {
      showToast(error.message, "error");
      return;
    }
  
    setQuoteName("");
    setQuoteEmail("");
    setQuotePhone("");
    setQuoteMessage("");
    setQuoteSent(true);
  
    showToast(
      "Richiesta di preventivo inviata correttamente all’azienda."
    );
  };

  const submitReview = async () => {
    if (!user || !company) return;
  
    if (!title.trim() || !content.trim()) {
      showToast(
        "Inserisci un titolo e descrivi la tua esperienza.",
        "error"
      );
      return;
    }
  
    const { error } = await supabase.from("reviews").insert({
      company_id: company.id,
      user_id: user.id,
      rating,
      title: title.trim(),
      content: content.trim(),
    });
  
    if (error) {
      showToast(error.message, "error");
      return;
    }
  
    setTitle("");
    setContent("");
    setRating(5);
  
    showToast("Recensione pubblicata correttamente.");
    await loadData();
  };

  if (!company) {
    return (
      <main className="p-10">
        Caricamento...
      </main>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    const percentage =
      reviews.length > 0 ? (count / reviews.length) * 100 : 0;
  
    return {
      star,
      count,
      percentage,
    };
  });

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />

      <section className="max-w-6xl mx-auto px-6 py-12">
<nav className="mb-8 text-sm text-gray-500">
  <a href="/" className="hover:text-black transition">
    Home
  </a>
  <span className="mx-2">/</span>
  <a href="/imprese" className="hover:text-black transition">
    Imprese
  </a>
  <span className="mx-2">/</span>
  <span className="text-black">
    {company.name}
  </span>
</nav>

<div className="mb-10 overflow-hidden rounded-[36px] border bg-gray-100">
  {images[0]?.image_url ? (
    <img
      src={images[0].image_url}
      alt={company.name}
      className="h-[260px] md:h-[420px] w-full object-cover"
    />
  ) : (
    <div className="h-[260px] md:h-[420px] flex flex-col items-center justify-center text-gray-500">
      <div className="text-7xl">🏗️</div>
      <p className="mt-4">Nessuna foto di copertina disponibile</p>
    </div>
  )}
</div>

  <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
    <div>
    <div className="flex flex-wrap items-center gap-3">

<span className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm font-medium">
  📍 {company.province || "FVG"}
</span>

<span className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm font-medium">
  🏗 {company.category || "Categoria"}
</span>

{company.verified && (
  <span className="bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-medium">
    🛡️ Impresa verificata
  </span>
)}

{company.claimed && (
  <span className="bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium">
    ✓ Profilo rivendicato
  </span>
)}

</div>

      <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-none">
        {company.name}
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        {company.city || "Città non indicata"} · Friuli Venezia Giulia
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">

<div className="text-3xl text-yellow-400">
  ★★★★★
</div>

<div className="text-3xl font-bold">
  {averageRating}
</div>

</div>

  <div className="text-gray-500">
    ({reviews.length} recensioni)
  </div>

  {company.claimed && (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
      Profilo rivendicato
    </span>
  )}
</div>

<div className="mt-6 max-w-md space-y-3">
  {ratingDistribution.map((item) => (
    <div key={item.star} className="flex items-center gap-3">
      <div className="w-16 text-sm text-gray-600">
        {item.star} stelle
      </div>

      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full"
          style={{ width: `${item.percentage}%` }}
        />
      </div>

      <div className="w-8 text-sm text-gray-500 text-right">
        {item.count}
      </div>
    </div>
  ))}
</div>

      <div className="mt-8 flex flex-wrap gap-3">
      <Button
  href="#preventivo"
  className="px-6 py-4"
>
  Richiedi preventivo
</Button>

{user && !company.claimed && !claimSent && (
  <Button
    variant="secondary"
    onClick={submitClaimRequest}
    className="px-6 py-4"
  >
    Rivendica questa azienda
  </Button>
)}
{company.claimed && (
  <div className="inline-flex items-center rounded-2xl bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
    ✓ Profilo già rivendicato
  </div>
)}
      </div>
    </div>

    <aside className="bg-white border rounded-[32px] p-6 md:p-8 shadow-sm">
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Contatti
      </p>

      <h2 className="mt-1 text-2xl font-semibold tracking-tight">
        Informazioni azienda
      </h2>
    </div>

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xl">
      🏢
    </div>
  </div>

  <div className="mt-7 space-y-3">
    {company.phone && (
      <a
        href={`tel:${company.phone.replace(/\s+/g, "")}`}
        className="group flex items-center gap-4 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg transition group-hover:bg-white">
          📞
        </span>

        <span className="min-w-0">
          <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
            Telefono
          </span>

          <span className="mt-1 block truncate font-medium text-black">
            {company.phone}
          </span>
        </span>
      </a>
    )}

    {company.email && (
      <a
        href={`mailto:${company.email}`}
        className="group flex items-center gap-4 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg transition group-hover:bg-white">
          ✉️
        </span>

        <span className="min-w-0">
          <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
            Email
          </span>

          <span className="mt-1 block truncate font-medium text-black">
            {company.email}
          </span>
        </span>
      </a>
    )}

    {company.website && (
      <a
        href={
          company.website.startsWith("http")
            ? company.website
            : `https://${company.website}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg transition group-hover:bg-white">
          🌐
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
            Sito web
          </span>

          <span className="mt-1 block truncate font-medium text-black">
            Visita il sito
          </span>
        </span>

        <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
          ↗
        </span>
      </a>
    )}

    {company.address && (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${company.address}, ${company.city || ""}, ${
            company.province || ""
          }`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg transition group-hover:bg-white">
          📍
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
            Indirizzo
          </span>

          <span className="mt-1 block font-medium text-black">
            {company.address}
          </span>

          {(company.city || company.province) && (
            <span className="mt-1 block text-sm text-gray-500">
              {[company.city, company.province]
                .filter(Boolean)
                .join(", ")}
            </span>
          )}
        </span>

        <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-black">
          ↗
        </span>
      </a>
    )}
  </div>

  {!company.phone &&
    !company.email &&
    !company.website &&
    !company.address && (
      <div className="mt-7 rounded-2xl bg-gray-50 p-5 text-sm leading-6 text-gray-500">
        I contatti dell’azienda non sono ancora disponibili.
      </div>
    )}

  <div className="mt-7 border-t pt-6">
    <dl className="space-y-3 text-sm">
      <div className="flex items-center justify-between gap-4">
        <dt className="text-gray-500">Categoria</dt>
        <dd className="text-right font-medium text-black">
          {company.category || "Non indicata"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-4">
        <dt className="text-gray-500">Città</dt>
        <dd className="text-right font-medium text-black">
          {company.city || "Non indicata"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-4">
        <dt className="text-gray-500">Provincia</dt>
        <dd className="text-right font-medium text-black">
          {company.province || "Non indicata"}
        </dd>
      </div>
    </dl>
  </div>
</aside>
  </div>

  <div className="mt-10">
    {images.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.image_url}
            alt="Foto azienda"
            className="w-full h-[300px] object-cover rounded-3xl"
          />
        ))}
      </div>
    ) : (
      <div className="h-[340px] rounded-[32px] border bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
  <div className="text-6xl">
    🏢
  </div>

  <p className="mt-5 text-gray-500">
    Nessuna immagine disponibile
  </p>
</div>
    )}
  </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold">
            Descrizione
          </h2>

          <p className="mt-4 text-gray-700">
            {company.description}
          </p>
        </div>
<div id="preventivo" className="mt-12">
  <h2 className="text-2xl font-semibold">
    Richiedi un preventivo
  </h2>

  <div className="mt-6 border rounded-3xl p-6 space-y-4">
    {quoteSent ? (
      <div className="rounded-2xl bg-green-50 p-5 text-green-800">
      <p className="font-medium">
        Richiesta inviata
      </p>
    
      <p className="mt-1 text-sm">
        L’azienda ha ricevuto il tuo messaggio e potrà ricontattarti utilizzando i dati forniti.
      </p>
    </div>
    ) : (
      <>
        <input
          value={quoteName}
          onChange={(e) => setQuoteName(e.target.value)}
          placeholder="Nome e cognome"
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          value={quoteEmail}
          onChange={(e) => setQuoteEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          value={quotePhone}
          onChange={(e) => setQuotePhone(e.target.value)}
          placeholder="Telefono"
          className="w-full border rounded-xl px-4 py-3"
        />

        <textarea
          value={quoteMessage}
          onChange={(e) => setQuoteMessage(e.target.value)}
          placeholder="Descrivi il lavoro che vuoi realizzare..."
          className="w-full border rounded-xl px-4 py-3 h-32"
        />

<Button
  onClick={submitQuoteRequest}
>
  Invia richiesta
</Button>
      </>
    )}
  </div>
</div>


        {/* REVIEW FORM */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">
            Lascia una recensione
          </h2>

          {user ? (
            <div className="mt-6 border rounded-3xl p-6 space-y-4">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Titolo recensione"
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Scrivi la tua esperienza..."
                className="w-full border rounded-xl px-4 py-3 h-32"
              />
              <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      type="button"
      onClick={() => setRating(star)}
      className={`text-3xl transition ${
        star <= rating ? "text-yellow-400" : "text-gray-300"
      }`}
    >
      ★
    </button>
  ))}

  <span className="ml-3 text-sm text-gray-500">
    {rating} {rating === 1 ? "stella" : "stelle"}
  </span>
</div>

<Button
  onClick={submitReview}
>
  Pubblica recensione
</Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-gray-50 border rounded-[32px] p-8 shadow-sm">
              Accedi per lasciare una recensione.
            </div>
          )}
        </div>

        {/* REVIEWS */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">
            Recensioni
          </h2>

          <div className="mt-6 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                key={review.id}
                className="bg-white border rounded-[32px] p-7 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-yellow-400 text-xl">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </div>
              
                    <h3 className="mt-4 text-xl font-semibold">
                      {review.title}
                    </h3>
              
                    <p className="mt-3 text-gray-700 leading-7">
                      “{review.content}”
                    </p>
              
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>
                        👤 {review.profiles?.full_name || "Utente EdilRate"}
                      </span>
              
                      <span>•</span>
              
                      <span>
                        📅 {new Date(review.created_at).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <p className="text-gray-500">Nessuna recensione disponibile.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}