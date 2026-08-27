import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_IMPORT_ROWS = 1000;

type ImportCompanyInput = {
  name?: unknown;
  slug?: unknown;
  phone?: unknown;
  city?: unknown;
  category?: unknown;
  description?: unknown;
  province?: unknown;
};

type ImportCompanyRow = {
  name: string;
  slug: string;
  phone: string;
  city: string;
  category: string;
  description: string;
  region: string;
  province: string;
  average_rating: number;
  review_count: number;
  verified: boolean;
  claimed: boolean;
  created_by: string;
};

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

    if (!Array.isArray(body.companies)) {
      return NextResponse.json(
        { error: "Dati di importazione non validi." },
        { status: 400 }
      );
    }

    if (
      body.companies.length === 0 ||
      body.companies.length > MAX_IMPORT_ROWS
    ) {
      return NextResponse.json(
        { error: "Numero di aziende da importare non valido." },
        { status: 400 }
      );
    }

    const companies = (body.companies as ImportCompanyInput[]).map(
      (company): ImportCompanyRow => ({
      name:
        typeof company.name === "string"
          ? company.name.trim()
          : "",
      slug:
        typeof company.slug === "string"
          ? company.slug.trim()
          : "",
      phone:
        typeof company.phone === "string"
          ? company.phone.trim()
          : "",
      city:
        typeof company.city === "string"
          ? company.city.trim()
          : "",
      category:
        typeof company.category === "string"
          ? company.category.trim()
          : "",
      description:
        typeof company.description === "string"
          ? company.description.trim()
          : "",
      region: "Friuli Venezia Giulia",
      province:
        typeof company.province === "string"
          ? company.province.trim()
          : "",
      average_rating: 0,
      review_count: 0,
      verified: false,
      claimed: false,
      created_by: user.id,
      })
    );

    if (
      companies.some(
        (company) => !company.name || !company.slug
      )
    ) {
      return NextResponse.json(
        { error: "Ogni azienda deve avere nome e slug." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("companies")
      .insert(companies);

    if (error) {
      console.error("Admin companies import error:", error);

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "L'import contiene uno slug già presente." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Impossibile importare le aziende." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        imported: companies.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin companies import error:", error);

    return NextResponse.json(
      { error: "Richiesta di importazione non valida." },
      { status: 400 }
    );
  }
}