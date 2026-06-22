"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
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
      await loadClaims();
    }
  
    setLoading(false);
  };
  const loadClaims = async () => {
    const { data, error } = await supabase
      .from("claim_requests")
      .select(`
        id,
        company_id,
        user_id,
        status,
        created_at,
        companies (
          name,
          city,
          category
        ),
        profiles (
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    setClaims(data || []);
  };

  const approveClaim = async (claim: any) => {
    const { error: companyError } = await supabase
      .from("companies")
      .update({
        claimed: true,
        claimed_by: claim.user_id,
      })
      .eq("id", claim.company_id);

    if (companyError) {
      alert(companyError.message);
      return;
    }

    const { error: claimError } = await supabase
      .from("claim_requests")
      .update({
        status: "approved",
      })
      .eq("id", claim.id);

    if (claimError) {
      alert(claimError.message);
      return;
    }

    alert("Richiesta approvata.");
    loadClaims();
  };

  const rejectClaim = async (claim: any) => {
    const { error } = await supabase
      .from("claim_requests")
      .update({
        status: "rejected",
      })
      .eq("id", claim.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Richiesta rifiutata.");
    loadClaims();
  };

  if (loading) {
    return (
      <main className="min-h-screen p-10">
        Caricamento...
      </main>
    );
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
        <h1 className="text-4xl font-bold">
          Richieste di rivendicazione
        </h1>

        <p className="mt-3 text-gray-600">
          Gestisci le richieste ricevute dalle aziende.
        </p>

        <div className="mt-10 space-y-4">
          {claims.length > 0 ? (
            claims.map((claim) => (
              <div
                key={claim.id}
                className="border rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold">
                    {claim.companies?.name || "Azienda non trovata"}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {claim.companies?.category} · {claim.companies?.city}
                  </p>

                  <p className="mt-3">
                    <strong>Utente:</strong>{" "}
                    {claim.profiles?.full_name || claim.user_id}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Stato: {claim.status}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(claim.created_at).toLocaleString()}
                  </p>
                </div>

                {claim.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => approveClaim(claim)}
                      className="bg-black text-white px-5 py-3 rounded-xl"
                    >
                      Approva
                    </button>

                    <button
                      onClick={() => rejectClaim(claim)}
                      className="border px-5 py-3 rounded-xl"
                    >
                      Rifiuta
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="border rounded-3xl p-6 text-gray-600">
              Nessuna richiesta ricevuta.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}