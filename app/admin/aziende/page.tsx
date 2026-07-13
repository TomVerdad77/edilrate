"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";

export default function AdminAziendePage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
  "all" | "claimed" | "unclaimed" | "verified"
>("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

useEffect(() => {
  checkAdmin();
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

const resetCompanyForm = () => {
  setEditingCompanyId(null);
  setNewName("");
  setNewPhone("");
  setNewCity("");
  setNewCategory("");
  setNewSubcategory("");
};

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replaceAll(" ", "-")
      .replace(/[^a-z0-9-]/g, "");
  };
  
  const editCompany = (company: any) => {
    setEditingCompanyId(company.id);
    setNewName(company.name || "");
    setNewPhone(company.phone || "");
    setNewCity(company.city || "");
    setNewCategory(company.category || "");
    setNewSubcategory(company.description || "");
  };

  const updateCompany = async () => {
    if (!editingCompanyId) return;
  
    if (!newName.trim()) {
      showToast("Inserisci il nome dell’azienda.", "error");
      return;
    }
  
    setSaving(true);
  
    const { error } = await supabase
      .from("companies")
      .update({
        name: newName.trim(),
        phone: newPhone.trim(),
        city: newCity.trim(),
        category: newCategory.trim(),
        description: newSubcategory.trim(),
      })
      .eq("id", editingCompanyId);
  
    if (error) {
      showToast(error.message, "error");
      setSaving(false);
      return;
    }
  
    showToast("Azienda aggiornata correttamente.");
    resetCompanyForm();
    await loadCompanies();
    setSaving(false);
  };

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (error) {
  showToast(error.message, "error");
  setLoading(false);
  return;
}

    if (data?.role === "admin") {
      setIsAdmin(true);
      await loadCompanies();
    }

    setLoading(false);
  };

  const createCompany = async () => {
    if (!newName.trim()) {
      showToast("Inserisci il nome dell’azienda.", "error");
      return;
    }
  
    setSaving(true);
  
    const slug = createSlug(newName);
  
    const { data: existingCompany, error: slugCheckError } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
  
    if (slugCheckError) {
      showToast(slugCheckError.message, "error");
      setSaving(false);
      return;
    }
  
    if (existingCompany) {
      showToast(
        "Esiste già un’azienda con questo nome o con lo stesso slug.",
        "error"
      );
      setSaving(false);
      return;
    }
  
    const { error } = await supabase.from("companies").insert({
      name: newName.trim(),
      slug,
      phone: newPhone.trim(),
      city: newCity.trim(),
      category: newCategory.trim(),
      description: newSubcategory.trim(),
      region: "Friuli Venezia Giulia",
      province: "TS",
      average_rating: 0,
      review_count: 0,
      verified: false,
      claimed: false,
    });
  
    if (error) {
      showToast(error.message, "error");
      setSaving(false);
      return;
    }
  
    showToast("Azienda aggiunta correttamente.");
    resetCompanyForm();
    await loadCompanies();
    setSaving(false);
  };

  const loadCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

      if (error) {
        showToast(error.message, "error");
        return;
      }

    setCompanies(data || []);
  };

  const claimedCompaniesCount = companies.filter(
    (company) => company.claimed
  ).length;
  
  const unclaimedCompaniesCount = companies.filter(
    (company) => !company.claimed
  ).length;
  
  const verifiedCompaniesCount = companies.filter(
    (company) => company.verified
  ).length;
  
  const filteredCompanies = companies.filter((company) => {
    const text = `
      ${company.name || ""}
      ${company.city || ""}
      ${company.province || ""}
      ${company.category || ""}
      ${company.description || ""}
      ${company.phone || ""}
      ${company.email || ""}
      ${company.website || ""}
    `.toLowerCase();
  
    const matchesSearch = text.includes(
      search.toLowerCase().trim()
    );
  
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "claimed"
          ? company.claimed
          : statusFilter === "unclaimed"
            ? !company.claimed
            : company.verified;
  
    return matchesSearch && matchesStatus;
  });
  
  if (!isAdmin) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">Accesso negato</h1>
        <p className="mt-4 text-gray-600">
          Non hai i permessi per visualizzare questa pagina.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <Toast
  message={toastMessage}
  type={toastType}
  onClose={() => setToastMessage("")}
/>

    <section className="max-w-7xl mx-auto px-6 py-12">
    <a
  href="/admin"
  className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-black"
>
  ← Torna alla Control Room
</a>

<div className="mt-6 overflow-hidden rounded-[36px] border bg-white shadow-sm">
  <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
          Gestione aziende
        </span>

        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          Database EdilRate
        </span>
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
        Aziende della piattaforma
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600">
        Cerca, aggiungi e aggiorna le imprese presenti nel database di
        EdilRate.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[480px]">
      <div className="rounded-3xl border bg-gray-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {companies.length}
        </p>

        <p className="mt-1 text-xs font-medium text-gray-600">
          Totali
        </p>
      </div>

      <div className="rounded-3xl border bg-green-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {claimedCompaniesCount}
        </p>

        <p className="mt-1 text-xs font-medium text-green-700">
          Rivendicate
        </p>
      </div>

      <div className="rounded-3xl border bg-orange-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {unclaimedCompaniesCount}
        </p>

        <p className="mt-1 text-xs font-medium text-orange-700">
          Non rivendicate
        </p>
      </div>

      <div className="rounded-3xl border bg-blue-50 p-4 text-center">
        <p className="text-2xl font-bold text-black">
          {verifiedCompaniesCount}
        </p>

        <p className="mt-1 text-xs font-medium text-blue-700">
          Verificate
        </p>
      </div>
    </div>
  </div>
</div>

<div className="mt-10 rounded-3xl border bg-white p-6 shadow-sm md:p-8">
<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
  <div>
    <p className="text-sm font-medium text-gray-500">
      {editingCompanyId
        ? "Aggiornamento profilo"
        : "Inserimento manuale"}
    </p>

    <h2 className="mt-1 text-2xl font-semibold">
      {editingCompanyId
        ? "Modifica azienda"
        : "Nuova azienda"}
    </h2>

    <p className="mt-2 text-sm text-gray-600">
      {editingCompanyId
        ? "Aggiorna i dati principali dell’azienda selezionata."
        : "Aggiungi manualmente una nuova impresa al database."}
    </p>
  </div>

  {editingCompanyId && (
    <span className="self-start rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
      Modalità modifica
    </span>
  )}
</div>

<div className="mt-8 grid gap-6 md:grid-cols-2">
<div>
  <label
    htmlFor="admin-company-name"
    className="text-sm font-medium text-black"
  >
    Nome azienda
  </label>

  <input
    id="admin-company-name"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    placeholder="Impresa Rossi S.r.l."
    className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
  />
</div>

<div>
  <label
    htmlFor="admin-company-phone"
    className="text-sm font-medium text-black"
  >
    Telefono
  </label>

  <input
    id="admin-company-phone"
    value={newPhone}
    onChange={(e) => setNewPhone(e.target.value)}
    placeholder="+39 040 1234567"
    type="tel"
    className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
  />
</div>

<div>
  <label
    htmlFor="admin-company-city"
    className="text-sm font-medium text-black"
  >
    Città
  </label>

  <input
    id="admin-company-city"
    value={newCity}
    onChange={(e) => setNewCity(e.target.value)}
    placeholder="Trieste"
    className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
  />
</div>

<div>
  <label
    htmlFor="admin-company-category"
    className="text-sm font-medium text-black"
  >
    Categoria
  </label>

  <input
    id="admin-company-category"
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    placeholder="Edilizia"
    className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
  />
</div>

<div className="md:col-span-2">
  <label
    htmlFor="admin-company-subcategory"
    className="text-sm font-medium text-black"
  >
    Attività principale
  </label>

  <p className="mt-1 text-xs text-gray-500">
    Inserisci una breve descrizione dell’attività svolta.
  </p>

  <input
    id="admin-company-subcategory"
    value={newSubcategory}
    onChange={(e) => setNewSubcategory(e.target.value)}
    placeholder="Ristrutturazioni e manutenzioni edili"
    className="mt-3 w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
  />
</div>
</div>

  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
  <Button
    onClick={
      editingCompanyId
        ? updateCompany
        : createCompany
    }
    disabled={saving}
    className="w-full sm:w-auto"
  >
    {saving
      ? "Salvataggio..."
      : editingCompanyId
        ? "Salva modifiche"
        : "Aggiungi azienda"}
  </Button>

  {editingCompanyId && (
    <Button
      variant="secondary"
      onClick={resetCompanyForm}
      disabled={saving}
      className="w-full sm:w-auto"
    >
      Annulla modifica
    </Button>
  )}
</div>
</div>

<div className="mt-10 rounded-3xl border bg-white p-5 shadow-sm md:p-6">
  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div className="w-full lg:max-w-xl">
      <label
        htmlFor="admin-companies-search"
        className="text-sm font-medium text-black"
      >
        Cerca aziende
      </label>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔎
        </span>

        <input
          id="admin-companies-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nome, città, categoria, telefono..."
          className="w-full rounded-2xl border py-3 pl-11 pr-4 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
        />
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {[
        {
          value: "all",
          label: `Tutte (${companies.length})`,
        },
        {
          value: "claimed",
          label: `Rivendicate (${claimedCompaniesCount})`,
        },
        {
          value: "unclaimed",
          label: `Non rivendicate (${unclaimedCompaniesCount})`,
        },
        {
          value: "verified",
          label: `Verificate (${verifiedCompaniesCount})`,
        },
      ].map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() =>
            setStatusFilter(
              filter.value as
                | "all"
                | "claimed"
                | "unclaimed"
                | "verified"
            )
          }
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            statusFilter === filter.value
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  </div>
</div>

<div className="mt-8">
  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Risultati
      </p>

      <p className="mt-1 text-lg font-semibold text-black">
        {filteredCompanies.length}{" "}
        {filteredCompanies.length === 1
          ? "azienda trovata"
          : "aziende trovate"}
      </p>
    </div>
  </div>

  <div className="space-y-4">
    {filteredCompanies.length > 0 ? (
      filteredCompanies.map((company) => (
        <article
          key={company.id}
          className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
            editingCompanyId === company.id
              ? "border-blue-300 ring-2 ring-blue-100"
              : ""
          }`}
        >
          <div className="p-6 md:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  {company.category && (
                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                      {company.category}
                    </span>
                  )}

                  {company.claimed ? (
                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                      ✓ Profilo rivendicato
                    </span>
                  ) : (
                    <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-700">
                      Non rivendicato
                    </span>
                  )}

                  {company.verified && (
                    <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700">
                      Impresa verificata
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-black">
                  {company.name}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
                  <span>
                    📍 {company.city || "Città non indicata"}
                  </span>

                  {company.province && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>{company.province}</span>
                    </>
                  )}
                </div>

                {company.description && (
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
                    {company.description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                  <span>
                    Slug:{" "}
                    <span className="font-medium text-gray-700">
                      {company.slug}
                    </span>
                  </span>

                  {company.phone && (
                    <span>
                      Telefono:{" "}
                      <span className="font-medium text-gray-700">
                        {company.phone}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto lg:min-w-[190px] lg:flex-col">
                <Button
                  href={`/imprese/${company.slug}`}
                  variant="secondary"
                  className="w-full"
                >
                  Vedi profilo
                </Button>

                <Button
                  onClick={() => {
                    editCompany(company);

                    window.setTimeout(() => {
                      document
                        .getElementById("admin-company-name")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }, 50);
                  }}
                  className="w-full"
                >
                  Modifica
                </Button>
              </div>
            </div>
          </div>
        </article>
      ))
    ) : (
      <div className="rounded-3xl border bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
          🏢
        </div>

        <h2 className="mt-5 text-xl font-semibold text-black">
          Nessuna azienda trovata
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Modifica la ricerca oppure seleziona un altro filtro.
        </p>

        <Button
          variant="secondary"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          className="mt-6"
        >
          Azzera filtri
        </Button>
      </div>
    )}
  </div>
</div>
      </section>
    </main>
  );
}