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

export async function GET(request: Request) {
  try {
    const { error: authError } = await getAdminUser(request);

    if (authError) {
      return authError;
    }

    const { data, error } = await supabaseAdmin
      .from("company_suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Company suggestions load error:", error);

      return NextResponse.json(
        { error: "Impossibile recuperare le segnalazioni." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      suggestions: data || [],
    });
  } catch (error) {
    console.error("Admin company suggestions GET error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { error: authError } = await getAdminUser(request);

    if (authError) {
      return authError;
    }

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    const status =
      body.status === "pending" ||
      body.status === "added" ||
      body.status === "rejected"
        ? body.status
        : null;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Richiesta non valida." },
        { status: 400 }
      );
    }

    const { data: suggestion, error: lookupError } =
      await supabaseAdmin
        .from("company_suggestions")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (lookupError) {
      console.error(
        "Company suggestion lookup error:",
        lookupError
      );

      return NextResponse.json(
        { error: "Impossibile recuperare la segnalazione." },
        { status: 500 }
      );
    }

    if (!suggestion) {
      return NextResponse.json(
        { error: "Segnalazione non trovata." },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("company_suggestions")
      .update({ status })
      .eq("id", id);

      if (updateError) {
      console.error(
        "Company suggestion update error:",
        updateError
      );

      return NextResponse.json(
        { error: "Impossibile aggiornare la segnalazione." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error(
      "Admin company suggestions PATCH error:",
      error
    );

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}
