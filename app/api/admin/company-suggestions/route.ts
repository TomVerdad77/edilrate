import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { Resend } from "resend";

export const runtime = "nodejs";
const resend = new Resend(process.env.RESEND_API_KEY);

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

    const companyId =
      typeof body.companyId === "string"
        ? body.companyId.trim()
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

    if (status === "added" && !companyId) {
      return NextResponse.json(
        { error: "Seleziona l'impresa collegata." },
        { status: 400 }
      );
    }

    const { data: suggestion, error: lookupError } =
      await supabaseAdmin
        .from("company_suggestions")
        .select("id, company_name, email, status")
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

    let linkedCompany:
      | {
          id: string;
          name: string;
          slug: string;
        }
      | null = null;

    if (status === "added") {
      const { data: company, error: companyError } =
        await supabaseAdmin
          .from("companies")
          .select("id, name, slug")
          .eq("id", companyId)
          .maybeSingle();

      if (companyError) {
        console.error(
          "Company suggestion linked company lookup error:",
          companyError
        );

        return NextResponse.json(
          {
            error:
              "Impossibile verificare l'impresa selezionata.",
          },
          { status: 500 }
        );
      }

      if (!company) {
        return NextResponse.json(
          { error: "L'impresa selezionata non esiste." },
          { status: 404 }
        );
      }

      linkedCompany = company;
    }

    const { error: updateError } = await supabaseAdmin
      .from("company_suggestions")
      .update({
        status,
        company_id:
          status === "added"
            ? companyId
            : null,
      })
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

    if (
      status === "added" &&
      suggestion.status !== "added" &&
      suggestion.email &&
      linkedCompany
    ) {
      try {
        const companyUrl = `https://edilrate.it/imprese/${linkedCompany.slug}`;
    
        const { error: emailError } = await resend.emails.send({
          from: "EdilRate <info@edilrate.it>",
          to: suggestion.email,
          subject: "L’impresa che hai segnalato è ora su EdilRate",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto;">
              <h2 style="margin-bottom: 16px;">
                L’impresa che hai segnalato è ora su EdilRate
              </h2>
    
              <p>
                Ciao,
              </p>
    
              <p>
                grazie per averci segnalato
                <strong>${linkedCompany.name}</strong>.
                L’impresa è stata aggiunta a EdilRate ed è ora disponibile sulla piattaforma.
              </p>
    
              <p>
                Puoi visitare il suo profilo e, se hai avuto un’esperienza con questa impresa,
                lasciare una recensione per aiutare altri utenti nella loro scelta.
              </p>
    
              <p style="margin: 28px 0;">
                <a
                  href="${companyUrl}"
                  style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;"
                >
                  Vai al profilo e lascia una recensione
                </a>
              </p>
    
              <p style="font-size: 14px; color: #6b7280;">
                Grazie per contribuire a rendere EdilRate più utile per tutti.
              </p>
    
              <p style="font-size: 14px; color: #6b7280;">
                Il team EdilRate
              </p>
            </div>
          `,
        });
    
        if (emailError) {
          console.error(
            "Company suggestion notification email error:",
            emailError
          );
        }
      } catch (emailError) {
        console.error(
          "Company suggestion notification email exception:",
          emailError
        );
      }
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