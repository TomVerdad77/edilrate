"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

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

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateQuoteStatus = async (quoteId: string, status: string) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", quoteId);

    if (error) {
      alert(error.message);
      return;
    }

    loadDashboard();
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
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("company-images")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("company_images").insert({
      company_id: company.id,
      image_url: data.publicUrl,
    });

    if (dbError) {
      alert(dbError.message);
      setUploading(false);
      return;
    }

    setUploading(false);
    loadDashboard();
  };

  const loadDashboard = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) return;

    const { data: companyData } = await supabase
      .from("companies")
      .select("*")
      .eq("claimed_by", user.id)
      .single();

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
      alert(error.message);
      return;
    }

    alert("Profilo aggiornato con successo.");
    await loadDashboard();
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
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Dashboard azienda</h1>

        <div className="mt-8 border rounded-3xl p-6">
        <div className="mt-10 border rounded-3xl p-6">
  <h2 className="text-2xl font-semibold">
    Modifica profilo azienda
  </h2>

  <div className="mt-6 space-y-4">
    <textarea
      value={description}
      onChange={(e) =>
        setDescription(e.target.value)
      }
      placeholder="Descrizione azienda"
      className="w-full border rounded-xl px-4 py-3 h-32"
    />

    <input
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="Telefono"
      className="w-full border rounded-xl px-4 py-3"
    />

    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
      className="w-full border rounded-xl px-4 py-3"
    />

    <input
      value={website}
      onChange={(e) => setWebsite(e.target.value)}
      placeholder="Sito web"
      className="w-full border rounded-xl px-4 py-3"
    />

    <input
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="Indirizzo"
      className="w-full border rounded-xl px-4 py-3"
    />

    <input
      value={services}
      onChange={(e) =>
        setServices(e.target.value)
      }
      placeholder="Servizi (separati da virgola)"
      className="w-full border rounded-xl px-4 py-3"
    />

    <input
      value={serviceAreas}
      onChange={(e) =>
        setServiceAreas(e.target.value)
      }
      placeholder="Zone operative (separate da virgola)"
      className="w-full border rounded-xl px-4 py-3"
    />

    <button
      onClick={() => saveCompanyProfile()} 
      className="bg-black text-white px-6 py-3 rounded-xl"
    >
      Salva modifiche
    </button>
  </div>
</div>
          <h2 className="text-2xl font-semibold">{company.name}</h2>
          <p className="mt-2 text-gray-600">
            {company.category} · {company.city}
          </p>
        </div>
        
        <div className="mt-10">
  <h2 className="text-2xl font-semibold">
    Foto azienda
  </h2>

  <div className="mt-6 border rounded-3xl p-6">
    <input
      type="file"
      accept="image/*"
      onChange={uploadImage}
      
    />

    {uploading && (
      <p className="mt-4 text-gray-600">
        Caricamento immagine...
      </p>
    )}

    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <img
          key={image.id}
          src={image.image_url}
          alt="Foto azienda"
          className="h-40 w-full object-cover rounded-2xl border"
        />
      ))}
    </div>
  </div>
</div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold">
            Richieste preventivo ricevute
          </h2>

          <div className="mt-6 space-y-4">
            {quotes.length > 0 ? (
              quotes.map((quote) => (
                <div key={quote.id} className="border rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {quote.customer_name}
                    </h3>

                    <span className="text-sm border px-3 py-1 rounded-full">
  {quote.status}
</span>
                  </div>

                  <p className="mt-3 text-gray-700">
                    {quote.message}
                  </p>

                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    <p>Email: {quote.customer_email}</p>
                    <p>Telefono: {quote.customer_phone}</p>
                  </div>
                  <div className="mt-5 flex gap-3">
  <button
    onClick={() => updateQuoteStatus(quote.id, "contacted")}
    className="px-4 py-2 bg-black text-white rounded-xl"
  >
    Segna come contattato
  </button>

  <button
    onClick={() => updateQuoteStatus(quote.id, "closed")}
    className="px-4 py-2 border rounded-xl"
  >
    Chiudi richiesta
  </button>
</div>
                </div>
                
              ))
            ) : (
              <div className="border rounded-3xl p-6 text-gray-600">
                Nessuna richiesta ricevuta.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}