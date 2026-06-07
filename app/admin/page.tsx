"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (!user) return;

    const { data } = await supabase
      .from("claim_requests")
      .select(`
        id,
        status,
        created_at,
        user_id,
        company_id,
        companies (
          id,
          name,
          city,
          category
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

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

    alert("Richiesta approvata!");
    loadAdmin();
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
    loadAdmin();
  };

  if (!user) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="mt-4 text-gray-600">
          Devi accedere per vedere questa pagina.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold">Admin EdilRate</h1>

        <p className="mt-3 text-gray-600">
          Gestisci le richieste di rivendicazione azienda.
        </p>

        <div className="mt-10 space-y-6">
          {claims.length > 0 ? (
            claims.map((claim) => (
              <div
                key={claim.id}
                className="border rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold">
                    {claim.companies?.name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {claim.companies?.category} · {claim.companies?.city}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    User ID: {claim.user_id}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => approveClaim(claim)}
                    className="px-5 py-3 bg-black text-white rounded-xl"
                  >
                    Approva
                  </button>

                  <button
                    onClick={() => rejectClaim(claim)}
                    className="px-5 py-3 border rounded-xl"
                  >
                    Rifiuta
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="border rounded-3xl p-6 text-gray-600">
              Nessuna richiesta in attesa.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}