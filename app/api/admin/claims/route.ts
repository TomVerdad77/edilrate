import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

async function getAdminUser(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Accesso non autorizzato." },
        { status: 401 }
      ),
    };
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
    return {
      user: null,
      error: NextResponse.json(
        { error: "Sessione non valida." },
        { status: 401 }
      ),
    };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Admin profile lookup error:", profileError);

    return {
      user: null,
      error: NextResponse.json(
        { error: "Impossibile verificare i permessi." },
        { status: 500 }
      ),
    };
  }

  if (profile?.role !== "admin") {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Permessi amministratore richiesti." },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    error: null,
  };
}

export async function PATCH(request: Request) {
  try {
    const { error: authError } = await getAdminUser(request);

    if (authError) {
      return authError;
    }

    const body = await request.json();

    const claimId =
      typeof body.claim_id === "string" ? body.claim_id.trim() : "";

    const action =
      body.action === "approve" || body.action === "reject"
        ? body.action
        : null;

    if (!claimId || !action) {
      return NextResponse.json(
        { error: "Richiesta non valida." },
        { status: 400 }
      );
    }

    const { data: claim, error: claimError } = await supabaseAdmin
      .from("claim_requests")
      .select("id, company_id, user_id, status")
      .eq("id", claimId)
      .maybeSingle();

    if (claimError) {
      console.error("Claim lookup error:", claimError);

      return NextResponse.json(
        { error: "Impossibile recuperare la richiesta." },
        { status: 500 }
      );
    }

    if (!claim) {
      return NextResponse.json(
        { error: "Richiesta non trovata." },
        { status: 404 }
      );
    }

    if (claim.status !== "pending") {
      return NextResponse.json(
        { error: "La richiesta è già stata elaborata." },
        { status: 409 }
      );
    }

    if (action === "reject") {
      const { error } = await supabaseAdmin
        .from("claim_requests")
        .update({
          status: "rejected",
        })
        .eq("id", claim.id);

      if (error) {
        console.error("Claim reject error:", error);

        return NextResponse.json(
          { error: "Impossibile rifiutare la richiesta." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        status: "rejected",
      });
    }

    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("id, claimed, claimed_by")
      .eq("id", claim.company_id)
      .maybeSingle();

    if (companyError) {
      console.error("Claim company lookup error:", companyError);

      return NextResponse.json(
        { error: "Impossibile recuperare l'impresa." },
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
        { error: "L'impresa risulta già rivendicata." },
        { status: 409 }
      );
    }

    const { error: companyUpdateError } = await supabaseAdmin
      .from("companies")
      .update({
        claimed: true,
        claimed_by: claim.user_id,
      })
      .eq("id", claim.company_id);

    if (companyUpdateError) {
      console.error("Company claim update error:", companyUpdateError);

      return NextResponse.json(
        { error: "Impossibile collegare l'impresa all'utente." },
        { status: 500 }
      );
    }

    const { error: claimUpdateError } = await supabaseAdmin
      .from("claim_requests")
      .update({
        status: "approved",
      })
      .eq("id", claim.id);

    if (claimUpdateError) {
      console.error("Claim approve update error:", claimUpdateError);

      await supabaseAdmin
        .from("companies")
        .update({
          claimed: false,
          claimed_by: null,
        })
        .eq("id", claim.company_id);

      return NextResponse.json(
        { error: "Impossibile completare l'approvazione." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "approved",
    });
  } catch (error) {
    console.error("Admin claim PATCH error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}