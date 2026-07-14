"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Toast from "@/components/ui/Toast";

export default function ImportPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
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
    }
  
    setLoading(false);
  };

  const createSlug = (name: string) =>
    name.toLowerCase().trim().replaceAll(" ", "-").replace(/[^a-z0-9-]/g, "");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    try {
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
  
      const validRows = allRows.filter((row: any) => row.Azienda);
  
      setRows(validRows);
  
      if (validRows.length === 0) {
        showToast(
          "Il file non contiene aziende valide da importare.",
          "error"
        );
        return;
      }
  
      showToast(
        `${validRows.length} ${
          validRows.length === 1 ? "azienda trovata" : "aziende trovate"
        } nel file.`
      );
    } catch {
      setRows([]);
      showToast(
        "Impossibile leggere il file Excel. Verifica il formato e riprova.",
        "error"
      );
    }
  };

  const importCompanies = async () => {
    if (rows.length === 0) {
      showToast("Seleziona prima un file Excel valido.", "error");
      return;
    }
  
    setImporting(true);
  
    const companies = rows.map((row: any, index: number) => ({
      name: row.Azienda,
      slug: `${createSlug(row.Azienda)}-${createSlug(
        row.Provincia || row.Città || "fvg"
      )}-${index}`,
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
  
    const { data: existingCompanies, error: existingCompaniesError } =
      await supabase.from("companies").select("slug");
  
    if (existingCompaniesError) {
      showToast(existingCompaniesError.message, "error");
      setImporting(false);
      return;
    }
  
    const existingSlugs = new Set(
      (existingCompanies || []).map((company: any) => company.slug)
    );
  
    const companiesToInsert = companies.filter(
      (company) => !existingSlugs.has(company.slug)
    );
  
    if (companiesToInsert.length === 0) {
      showToast("Nessuna nuova azienda da importare.", "error");
      setImporting(false);
      return;
    }
  
    const { error } = await supabase
      .from("companies")
      .insert(companiesToInsert);
  
    if (error) {
      showToast(error.message, "error");
      setImporting(false);
      return;
    }
  
    showToast(
      `${companiesToInsert.length} ${
        companiesToInsert.length === 1
          ? "azienda importata"
          : "aziende importate"
      } con successo.`
    );
  
    setRows([]);
    setImporting(false);
  };

  if (loading) {
    return <Loading text="Caricamento import aziende..." />;
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
      <Toast
  message={toastMessage}
  type={toastType}
  onClose={() => setToastMessage("")}
/>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Import aziende</h1>

        <p className="mt-3 text-gray-600">
          Carica un file Excel con le aziende da inserire su EdilRate.
        </p>

        <div className="mt-8 border rounded-3xl p-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="block w-full cursor-pointer rounded-2xl border bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
          />

          {rows.length > 0 && (
            <>
              <p className="mt-6 text-gray-700">
                Aziende trovate: {rows.length}
              </p>

              <Button
                onClick={importCompanies}
                disabled={importing}
                className="mt-4 w-full sm:w-auto"
                >
                {importing ? "Importazione in corso..." : "Importa aziende"}
              </Button>
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