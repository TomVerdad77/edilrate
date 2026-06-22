"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function ImportPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);
  
  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      setLoading(false);
      return;
    }
  
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
  
    if (data?.role === "admin") {
      setIsAdmin(true);
    }
  
    setLoading(false);
  };

  const createSlug = (name: string) =>
    name.toLowerCase().trim().replaceAll(" ", "-").replace(/[^a-z0-9-]/g, "");

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const XLSX = await import("xlsx");
  
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
  
    const allRows = workbook.SheetNames.flatMap((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
  
      return json.map((row: any) => ({
        ...row,
        Provincia: sheetName,
      }));
    });
  
    setRows(allRows.filter((row: any) => row.Azienda));
  };

  const importCompanies = async () => {
    const companies = rows.map((row: any, index: number) => ({
        name: row.Azienda,
        slug: `${createSlug(row.Azienda)}-${createSlug(row.Provincia || row.Città || "fvg")}-${index}`,
        phone: row.Telefono?.toString() || "",
        city: row.Città || "",
        category: row.Categoria || "",
        description: row.Sottocategoria || "",
        region: "Friuli Venezia Giulia",
        province: row.Provincia || "",
        average_rating: 0,
        review_count: 0,
        verified: false,
        claimed: false,
      }));

      const { data: existingCompanies } = await supabase
      .from("companies")
      .select("slug");
    
    const existingSlugs = new Set(
      (existingCompanies || []).map((company: any) => company.slug)
    );
    
    const companiesToInsert = companies.filter(
      (company) => !existingSlugs.has(company.slug)
    );
    
    if (companiesToInsert.length === 0) {
      alert("Nessuna nuova azienda da importare.");
      return;
    }
    
    const { error } = await supabase
      .from("companies")
      .insert(companiesToInsert);
    
    if (error) {
      alert(error.message);
      return;
    }

    alert(`${companiesToInsert.length} aziende importate con successo!`);
    setRows([]);
  };

  if (loading) {
    return <main className="min-h-screen p-10">Caricamento...</main>;
  }
  
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
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Import aziende</h1>

        <p className="mt-3 text-gray-600">
          Carica un file Excel con le aziende da inserire su EdilRate.
        </p>

        <div className="mt-8 border rounded-3xl p-6">
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

          {rows.length > 0 && (
            <>
              <p className="mt-6 text-gray-700">
                Aziende trovate: {rows.length}
              </p>

              <button
                onClick={importCompanies}
                className="mt-4 bg-black text-white px-6 py-3 rounded-xl"
              >
                Importa aziende
              </button>
            </>
          )}
        </div>

        <div className="mt-10 space-y-3">
          {rows.map((row, index) => (
            <div key={index} className="border rounded-2xl p-4">
             <strong>{row.Azienda}</strong>
<p className="text-sm text-gray-600">
  {row.Provincia} · {row.Città} · {row.Categoria} · {row.Sottocategoria}
</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}