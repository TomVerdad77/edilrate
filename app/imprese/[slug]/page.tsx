"use client";

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
        .select("*")
        .eq("company_id", companyData.id)
        .order("created_at", {
          ascending: false,
        });

      setReviews(reviewsData || []);
      const { data: imageData } = await supabase
  .from("company_images")
  .select("*")
  .eq("company_id", companyData.id)
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
      alert(error.message);
      return;
    }

    setClaimSent(true);
  };

  const submitQuoteRequest = async () => {
    if (!company) return;

    const { error } = await supabase.from("quote_requests").insert({
      company_id: company.id,
      customer_name: quoteName,
      customer_email: quoteEmail,
      customer_phone: quotePhone,
      message: quoteMessage,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setQuoteName("");
    setQuoteEmail("");
    setQuotePhone("");
    setQuoteMessage("");
    setQuoteSent(true);
  };

  const submitReview = async () => {
    if (!user || !company) return;
  
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email,
      avatar_url: user.user_metadata?.avatar_url,
      role: "user",
    });
  
    const { error } = await supabase.from("reviews").insert({
      company_id: company.id,
      user_id: user.id,
      rating,
      title,
      content,
    });
  
    if (error) {
      alert(error.message);
      return;
    }
  
    setTitle("");
    setContent("");
    setRating(5);
  
    loadData();
  };

  if (!company) {
    return (
      <main className="p-10">
        Caricamento...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold">
              {company.name}
            </h1>

            <p className="mt-4 text-gray-600">
              {company.category} · {company.city}
            </p>

            <p className="mt-2">
              ⭐ {company.average_rating ?? 0} ·{" "}
              {company.review_count ?? 0} recensioni
            </p>
          </div>

          <a
  href="#preventivo"
  className="bg-black text-white px-6 py-4 rounded-2xl"
>
  Richiedi preventivo
  
</a>
{user && !claimSent && (
  <button
    onClick={submitClaimRequest}
    className="border px-6 py-4 rounded-2xl"
  >
    Rivendica questa azienda
  </button>
)}
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
    <div className="h-[400px] bg-gray-200 rounded-3xl flex items-center justify-center text-gray-500">
      Nessuna immagine caricata
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
      <p className="text-green-700">
        Richiesta inviata correttamente. L’azienda riceverà il tuo messaggio.
      </p>
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

        <button
          onClick={() => submitQuoteRequest()} 
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Invia richiesta
        </button>
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

              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
                className="border rounded-xl px-4 py-3"
              >
                <option value={5}>5 stelle</option>
                <option value={4}>4 stelle</option>
                <option value={3}>3 stelle</option>
                <option value={2}>2 stelle</option>
                <option value={1}>1 stella</option>
              </select>

              <button
                onClick={submitReview}
                className="bg-black text-white px-6 py-3 rounded-xl"
              >
                Pubblica recensione
              </button>
            </div>
          ) : (
            <div className="mt-6 border rounded-3xl p-6">
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
                  className="border rounded-3xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {review.title}
                    </h3>

                    <span>
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>

                  <p className="mt-4 text-gray-700">
                    {review.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="border rounded-3xl p-6">
                Nessuna recensione disponibile.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}