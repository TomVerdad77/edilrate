"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Toast from "@/components/ui/Toast";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
const [phone, setPhone] = useState("");
const [email, setEmail] = useState("");
const [website, setWebsite] = useState("");
const [address, setAddress] = useState("");
const [services, setServices] = useState("");
const [serviceAreas, setServiceAreas] = useState("");
const [toastMessage, setToastMessage] = useState("");
const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    loadDashboard();
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

  const updateQuoteStatus = async (
    quoteId: string,
    status: "pending" | "contacted" | "closed"
  ) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", quoteId);
  
    if (error) {
      showToast(error.message, "error");
      return;
    }
  
    if (status === "contacted") {
      showToast("La richiesta è stata segnata come contattata.");
    }
  
    if (status === "closed") {
      showToast("La richiesta è stata chiusa correttamente.");
    }
  
    await loadDashboard();
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !company) return;

    setUploading(true);

    const filePath = `${company.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("company-images")
      .upload(filePath, file);

      if (uploadError) {
        showToast(uploadError.message, "error");
        setUploading(false);
        return;
      }

    const { data } = supabase.storage
      .from("company-images")
      .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("company_images").insert({
        company_id: company.id,
        image_url: data.publicUrl,
        storage_path: filePath,
      });

      if (dbError) {
        await supabase.storage
          .from("company-images")
          .remove([filePath]);
      
        showToast(dbError.message, "error");
        setUploading(false);
        return;
      }
      setUploading(false);
      showToast("Immagine caricata correttamente.");
      await loadDashboard();
  };

  const deleteImage = async (image: any) => {
    const confirmDelete = window.confirm("Vuoi eliminare questa immagine?");
    if (!confirmDelete) return;
  
    if (image.storage_path) {
      const { error: storageError } = await supabase.storage
        .from("company-images")
        .remove([image.storage_path]);
  
        if (storageError) {
          showToast(
            `Impossibile eliminare il file dallo storage: ${storageError.message}`,
            "error"
          );
          return;
        }
    }
  
    const { error: dbError } = await supabase
      .from("company_images")
      .delete()
      .eq("id", image.id);
  
      if (dbError) {
        showToast(dbError.message, "error");
        return;
      }
      
      showToast("Immagine eliminata correttamente.");
      await loadDashboard();
  };

  const setCoverImage = async (imageId: string) => {
    if (!company) return;
  
    const { error: resetError } = await supabase
      .from("company_images")
      .update({ is_cover: false })
      .eq("company_id", company.id);
  
      if (resetError) {
        showToast(resetError.message, "error");
        return;
      }
  
    const { error: coverError } = await supabase
      .from("company_images")
      .update({ is_cover: true })
      .eq("id", imageId);
  
      if (coverError) {
        showToast(coverError.message, "error");
        return;
      }
      
      showToast("Foto di copertina aggiornata correttamente.");
      await loadDashboard();
  
  };

  const loadDashboard = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

if (!user) {
  window.location.replace("/auth/login");
  return;
}

    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .eq("claimed_by", user.id)
      .single();

      if (!companyData) {
        window.location.replace("/");
        return;
      }
      
      setCompany(companyData);
    
    setDescription(companyData.description || "");
    setPhone(companyData.phone || "");
    setEmail(companyData.email || "");
    setWebsite(companyData.website || "");
    setAddress(companyData.address || "");
    setServices(companyData.services?.join(", ") || "");
    setServiceAreas(companyData.service_areas?.join(", ") || "");

    if (companyData) {
      const { data: quoteData } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("company_id", companyData.id)
        .order("created_at", { ascending: false });

      setQuotes(quoteData || []);
      const { data: imageData } = await supabase
  .from("company_images")
  .select("*")
  .eq("company_id", companyData.id)
  .order("created_at", { ascending: false });

setImages(imageData || []);
    }
  };

  const saveCompanyProfile = async () => {
    if (!company) return;

    const parsedServices = services
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const parsedServiceAreas = serviceAreas
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("companies")
      .update({
        description,
        phone,
        email,
        website,
        address,
        services: parsedServices,
        service_areas: parsedServiceAreas,
      })
      .eq("id", company.id);

      if (error) {
        showToast(error.message, "error");
        return;
      }

    showToast("Profilo aggiornato con successo.");
    await loadDashboard();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            🟡 Da contattare
          </span>
        );
  
      case "contacted":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            🟢 Contattata
          </span>
        );
  
      case "closed":
        return (
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            ⚫ Chiusa
          </span>
        );
  
      default:
        return (
          <span className="border px-3 py-1 rounded-full text-sm">
            {status}
          </span>
        );
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">Dashboard azienda</h1>
        <p className="mt-4 text-gray-600">
          Devi accedere per vedere la dashboard.
        </p>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">Dashboard azienda</h1>
        <p className="mt-4 text-gray-600">
          Nessuna azienda collegata al tuo account.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
  <Navbar />

  <Toast
  message={toastMessage}
  type={toastType}
  onClose={() => setToastMessage("")}
/>

  <section className="max-w-6xl mx-auto px-6 py-12">

  <div className="overflow-hidden rounded-[36px] border bg-white shadow-sm">
  <div className="grid gap-8 p-6 sm:p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          Area riservata azienda
        </span>

        {company.verified && (
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            ✓ Impresa verificata
          </span>
        )}

        {company.claimed && (
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Profilo rivendicato
          </span>
        )}
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Benvenuto, {company.name} 👋
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Gestisci le informazioni del profilo, aggiorna la galleria e controlla
        le richieste di preventivo ricevute.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Valutazione
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-yellow-400">
              ★
            </span>

            <span className="text-lg font-semibold text-black">
              {company.average_rating?.toFixed(1) ?? "0.0"}
            </span>
          </div>
        </div>

        <div className="hidden h-10 w-px bg-gray-200 sm:block" />

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Recensioni
          </p>

          <p className="mt-1 text-lg font-semibold text-black">
            {company.review_count ?? 0}
          </p>
        </div>

        <div className="hidden h-10 w-px bg-gray-200 sm:block" />

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Richieste
          </p>

          <p className="mt-1 text-lg font-semibold text-black">
            {quotes.length}
          </p>
        </div>

        <div className="hidden h-10 w-px bg-gray-200 sm:block" />

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Foto
          </p>

          <p className="mt-1 text-lg font-semibold text-black">
            {images.length}
          </p>
        </div>
      </div>
    </div>

    <div className="flex w-full flex-col gap-3 sm:w-auto lg:min-w-[210px]">
      <a
        href={`/imprese/${company.slug}`}
        className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Vedi profilo pubblico
      </a>

      <a
        href="#modifica-profilo"
        className="inline-flex items-center justify-center rounded-2xl border bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-100"
      >
        Modifica profilo
      </a>
    </div>
  </div>
</div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border rounded-3xl p-5 md:p-6 shadow-sm">
  <div className="text-3xl">📨</div>
  <p className="mt-4 text-sm text-gray-500">Richieste totali</p>
  <p className="mt-2 text-3xl font-bold">{quotes.length}</p>
</div>

<div className="bg-white border rounded-3xl p-5 md:p-6 shadow-sm">
  <div className="text-3xl">🟡</div>
  <p className="mt-4 text-sm text-gray-500">Da contattare</p>
  <p className="mt-2 text-3xl font-bold">
    {quotes.filter((quote) => quote.status === "pending").length}
  </p>
</div>

<div className="bg-white border rounded-3xl p-5 md:p-6 shadow-sm">
  <div className="text-3xl">✅</div>
  <p className="mt-4 text-sm text-gray-500">Contattate</p>
  <p className="mt-2 text-3xl font-bold">
    {quotes.filter((quote) => quote.status === "contacted").length}
  </p>
</div>

<div className="bg-white border rounded-3xl p-5 md:p-6 shadow-sm">
  <div className="text-3xl">📷</div>
  <p className="mt-4 text-sm text-gray-500">Foto caricate</p>
  <p className="mt-2 text-3xl font-bold">{images.length}</p>
</div>

<div className="bg-white border rounded-3xl p-5 md:p-6 shadow-sm">
  <div className="text-3xl">⭐</div>

  <p className="mt-4 text-sm text-gray-500">
    Valutazione media
  </p>

  <p className="mt-2 text-3xl font-bold">
    {company.average_rating?.toFixed(1) ?? "0.0"}
  </p>

  <p className="mt-2 text-sm text-gray-500">
    {company.review_count ?? 0} recensioni
  </p>
</div>

</div>
<div
  id="modifica-profilo"
  className="mt-10 scroll-mt-24 rounded-3xl border bg-white p-6 shadow-sm md:p-8"
>
  <div>
    <p className="text-sm font-medium text-gray-500">
      Profilo pubblico
    </p>

    <h2 className="mt-1 text-2xl font-semibold">
      Modifica profilo azienda
    </h2>

    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
      Mantieni aggiornati i dati mostrati agli utenti nella pagina pubblica
      della tua azienda.
    </p>
  </div>

  <div className="mt-8 grid gap-6 md:grid-cols-2">
    <div className="md:col-span-2">
      <label
        htmlFor="company-description"
        className="text-sm font-medium text-black"
      >
        Descrizione azienda
      </label>

      <p className="mt-1 text-xs text-gray-500">
        Presenta l’azienda, l’esperienza maturata e il tipo di lavori svolti.
      </p>

      <textarea
        id="company-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Racconta chi siete e di cosa vi occupate..."
        className="mt-3 h-40 w-full resize-y rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />
    </div>

    <div>
      <label
        htmlFor="company-phone"
        className="text-sm font-medium text-black"
      >
        Telefono
      </label>

      <input
        id="company-phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+39 040 1234567"
        type="tel"
        className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />
    </div>

    <div>
      <label
        htmlFor="company-email"
        className="text-sm font-medium text-black"
      >
        Email
      </label>

      <input
        id="company-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="info@azienda.it"
        type="email"
        className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />
    </div>

    <div>
      <label
        htmlFor="company-website"
        className="text-sm font-medium text-black"
      >
        Sito web
      </label>

      <input
        id="company-website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        placeholder="https://www.azienda.it"
        type="url"
        className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />
    </div>

    <div>
      <label
        htmlFor="company-address"
        className="text-sm font-medium text-black"
      >
        Indirizzo
      </label>

      <input
        id="company-address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Via Roma 10, Trieste"
        className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />
    </div>

    <div>
      <label
        htmlFor="company-services"
        className="text-sm font-medium text-black"
      >
        Servizi
      </label>

      <p className="mt-1 text-xs text-gray-500">
        Inserisci i servizi separati da una virgola.
      </p>

      <input
        id="company-services"
        value={services}
        onChange={(e) => setServices(e.target.value)}
        placeholder="Ristrutturazioni, tetti, cappotto termico"
        className="mt-3 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />
    </div>

    <div>
      <label
        htmlFor="company-service-areas"
        className="text-sm font-medium text-black"
      >
        Zone operative
      </label>

      <p className="mt-1 text-xs text-gray-500">
        Inserisci città o province separate da una virgola.
      </p>

      <input
        id="company-service-areas"
        value={serviceAreas}
        onChange={(e) => setServiceAreas(e.target.value)}
        placeholder="Trieste, Gorizia, Udine"
        className="mt-3 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
      />
    </div>
  </div>

  <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm text-gray-500">
      Le modifiche saranno visibili subito nel profilo pubblico.
    </p>

    <Button
      onClick={saveCompanyProfile}
      className="w-full px-6 sm:w-auto"
    >
      Salva modifiche
    </Button>
  </div>
</div>

<div className="mt-10">
  <div>
    <p className="text-sm font-medium text-gray-500">
      Galleria aziendale
    </p>

    <h2 className="mt-1 text-2xl font-semibold">
      Foto azienda
    </h2>

    <p className="mt-2 text-sm text-gray-600">
      Carica immagini dei tuoi lavori, del team o dei cantieri completati.
    </p>
  </div>

  <div className="mt-6 bg-white border rounded-3xl p-6 shadow-sm">
    <label
      htmlFor="company-image-upload"
      className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition ${
        uploading
          ? "cursor-not-allowed border-gray-200 bg-gray-50"
          : "border-gray-300 bg-gray-50 hover:border-black hover:bg-white"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border text-3xl shadow-sm">
        📷
      </div>

      <h3 className="mt-5 text-lg font-semibold text-black">
        {uploading
          ? "Caricamento in corso..."
          : "Carica una nuova foto"}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        Seleziona un’immagine dal tuo dispositivo. Per un risultato migliore,
        utilizza fotografie nitide e in formato orizzontale.
      </p>

      <span
        className={`mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition ${
          uploading
            ? "bg-gray-200 text-gray-500"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {uploading ? "Caricamento..." : "Scegli immagine"}
      </span>

      <p className="mt-4 text-xs text-gray-400">
        JPG, PNG o WEBP
      </p>
    </label>

    <input
      id="company-image-upload"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={uploadImage}
      disabled={uploading}
      className="hidden"
    />

    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {images.length > 0 ? (
  images.map((image) => (
  <div
    key={image.id}
    className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md"
  >
    <div className="relative">
      <img
        src={image.image_url}
        alt={`Foto di ${company.name}`}
        className="h-52 w-full object-cover"
      />

      {image.is_cover && (
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-black shadow-sm backdrop-blur">
          ⭐ Copertina
        </span>
      )}
    </div>

    <div className="p-4">
      {image.is_cover ? (
        <div className="flex min-h-[44px] items-center justify-center rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Foto di copertina attiva
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCoverImage(image.id)}
          className="flex min-h-[44px] w-full items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium text-black transition hover:border-black hover:bg-gray-50"
        >
          ⭐ Imposta come copertina
        </button>
      )}

      <button
        type="button"
        onClick={() => deleteImage(image)}
        className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        🗑 Elimina immagine
      </button>
    </div>
  </div>
))
) : (
  <div className="sm:col-span-2 lg:col-span-4 rounded-3xl border bg-gray-50 px-6 py-12 text-center">
    <div className="text-4xl">
      🖼️
    </div>

    <h3 className="mt-4 font-semibold text-black">
      Nessuna foto caricata
    </h3>

    <p className="mt-2 text-sm text-gray-500">
      Carica la prima immagine per rendere il profilo aziendale più completo.
    </p>
  </div>
)}
    </div>
  </div>
</div>

<div className="mt-10">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Opportunità commerciali
      </p>

      <h2 className="mt-1 text-2xl font-semibold">
        Richieste di preventivo
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        Gestisci i contatti ricevuti attraverso il profilo pubblico.
      </p>
    </div>

    <div className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-gray-700">
      {quotes.length} {quotes.length === 1 ? "richiesta" : "richieste"}
    </div>
  </div>

  <div className="mt-6 space-y-4">
    {quotes.length > 0 ? (
      quotes.map((quote) => (
        <article
          key={quote.id}
          className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="p-6 md:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-lg font-semibold text-black">
                  {quote.customer_name?.trim()?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-black">
                    {quote.customer_name || "Utente EdilRate"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Ricevuta il{" "}
                    {new Date(quote.created_at).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {getStatusBadge(quote.status)}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Descrizione del lavoro
              </p>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">
                {quote.message || "Nessuna descrizione fornita."}
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {quote.customer_email && (
                <a
                  href={`mailto:${quote.customer_email}`}
                  className="group flex items-center gap-3 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    ✉️
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs text-gray-500">
                      Email
                    </span>

                    <span className="mt-1 block truncate text-sm font-medium text-black">
                      {quote.customer_email}
                    </span>
                  </span>
                </a>
              )}

              {quote.customer_phone && (
                <a
                  href={`tel:${quote.customer_phone.replace(/\s+/g, "")}`}
                  className="group flex items-center gap-3 rounded-2xl border p-4 transition hover:border-black hover:bg-gray-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    📞
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs text-gray-500">
                      Telefono
                    </span>

                    <span className="mt-1 block truncate text-sm font-medium text-black">
                      {quote.customer_phone}
                    </span>
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t bg-gray-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <p className="text-xs text-gray-500">
              Aggiorna lo stato dopo aver gestito la richiesta.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              {quote.status === "pending" && (
                <Button
                  onClick={() =>
                    updateQuoteStatus(quote.id, "contacted")
                  }
                  className="w-full sm:w-auto"
                >
                  Segna come contattata
                </Button>
              )}

              {quote.status !== "closed" && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateQuoteStatus(quote.id, "closed")
                  }
                  className="w-full sm:w-auto"
                >
                  Chiudi richiesta
                </Button>
              )}

              {quote.status === "closed" && (
                <span className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-gray-200 px-5 py-3 text-sm font-medium text-gray-600">
                  Richiesta completata
                </span>
              )}
            </div>
          </div>
        </article>
      ))
    ) : (
      <div className="rounded-3xl border bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          📨
        </div>

        <h3 className="mt-5 text-lg font-semibold text-black">
          Nessuna richiesta ricevuta
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Le richieste inviate dagli utenti attraverso il profilo pubblico
          appariranno qui.
        </p>

        <Button
          href={`/imprese/${company.slug}`}
          variant="secondary"
          className="mt-6"
        >
          Controlla il profilo pubblico
        </Button>
      </div>
    )}
  </div>
</div>
</section>
<Footer />
</main>
);
}