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

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        { error: "ID azienda mancante." },
        { status: 400 }
      );
    }

    const allowedFields = [
      "name",
      "slug",
      "phone",
      "email",
      "website",
      "address",
      "city",
      "province",
      "region",
      "category",
      "description",
      "services",
      "service_areas",
      "claimed",
      "claimed_by",
      "verified",
    ] as const;

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nessun campo valido da aggiornare." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("companies")
      .update(updates)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Admin company update error:", error);

      return NextResponse.json(
        { error: "Impossibile aggiornare l'azienda." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Azienda non trovata." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin company PATCH error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      user,
      error: authError,
    } = await getAdminUser(request);

    if (authError || !user) {
      return authError;
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nome e slug sono obbligatori." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("companies")
      .insert({
        name,
        slug,
        phone:
          typeof body.phone === "string"
            ? body.phone.trim()
            : "",
        city:
          typeof body.city === "string"
            ? body.city.trim()
            : "",
        category:
          typeof body.category === "string"
            ? body.category.trim()
            : "",
        description:
          typeof body.description === "string"
            ? body.description.trim()
            : "",
        region: "Friuli Venezia Giulia",
        province: "TS",
        average_rating: 0,
        review_count: 0,
        verified: false,
        claimed: false,
        created_by: user.id,
      });

    if (error) {
      console.error("Admin company insert error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Esiste già un'azienda con questo slug." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Impossibile creare l'azienda." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin company POST error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}