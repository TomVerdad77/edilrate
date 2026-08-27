import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

const allowedStatuses = ["pending", "contacted", "closed"] as const;

type QuoteStatus = (typeof allowedStatuses)[number];

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

  return { user, error: null };
}

export async function PATCH(request: Request) {
  try {
    const { user, error: authError } = await getAdminUser(request);

    if (authError || !user) {
      return authError;
    }

    const body = await request.json();

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const status =
      typeof body.status === "string" ? body.status.trim() : "";

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!id || !uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Richiesta di preventivo non valida." },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status as QuoteStatus)) {
      return NextResponse.json(
        { error: "Stato non valido." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quote_requests")
      .update({ status })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Admin quote status update error:", error);

      return NextResponse.json(
        { error: "Impossibile aggiornare la richiesta." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Richiesta di preventivo non trovata." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin quote status API error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}