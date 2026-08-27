import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Devi effettuare l'accesso per rivendicare un'impresa." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Sessione non valida. Effettua nuovamente l'accesso." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const companyId =
      typeof body.company_id === "string" ? body.company_id.trim() : "";

    if (!companyId || !uuidRegex.test(companyId)) {
      return NextResponse.json(
        { error: "Impresa non valida." },
        { status: 400 }
      );
    }

    // Verifica che l'impresa esista e non sia già rivendicata
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("id, claimed, claimed_by")
      .eq("id", companyId)
      .maybeSingle();

    if (companyError) {
      console.error("Claim company lookup error:", companyError);

      return NextResponse.json(
        { error: "Impossibile verificare l'impresa." },
        { status: 500 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { error: "Impresa non trovata." },
        { status: 404 }
      );
    }

    if (company.claimed) {
      return NextResponse.json(
        {
          error:
            company.claimed_by === user.id
              ? "Questa azienda è già collegata al tuo account."
              : "Questa azienda è già stata rivendicata.",
        },
        { status: 409 }
      );
    }

    // Controllo esplicito di eventuale claim pending/approved
    const { data: existingClaim, error: existingClaimError } =
      await supabaseAdmin
        .from("claim_requests")
        .select("id, status")
        .eq("company_id", companyId)
        .eq("user_id", user.id)
        .in("status", ["pending", "approved"])
        .maybeSingle();

    if (existingClaimError) {
      console.error("Existing claim lookup error:", existingClaimError);

      return NextResponse.json(
        { error: "Impossibile verificare le richieste esistenti." },
        { status: 500 }
      );
    }

    if (existingClaim) {
      return NextResponse.json(
        {
          error:
            existingClaim.status === "approved"
              ? "Questa azienda è già collegata al tuo account."
              : "Hai già inviato una richiesta per questa azienda.",
        },
        { status: 409 }
      );
    }

    // user_id e status NON arrivano dal browser
    const { data: claim, error: insertError } = await supabaseAdmin
      .from("claim_requests")
      .insert({
        company_id: companyId,
        user_id: user.id,
        status: "pending",
      })
      .select("id, status")
      .single();

    if (insertError) {
      // Protezione aggiuntiva grazie all'indice UNIQUE parziale
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Hai già inviato una richiesta per questa azienda." },
          { status: 409 }
        );
      }

      console.error("Claim insert error:", insertError);

      return NextResponse.json(
        { error: "Impossibile inviare la richiesta di rivendicazione." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        claim,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Claim API error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}