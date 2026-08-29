import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Utente non autenticato." },
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
        { error: "Sessione non valida." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const reviewId =
      typeof body.review_id === "string"
        ? body.review_id.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!reviewId || !uuidRegex.test(reviewId)) {
      return NextResponse.json(
        { error: "Recensione non valida." },
        { status: 400 }
      );
    }

    if (content.length < 2 || content.length > 2000) {
      return NextResponse.json(
        {
          error:
            "La risposta deve contenere tra 2 e 2000 caratteri.",
        },
        { status: 400 }
      );
    }

    // Recupera l'azienda collegata all'utente autenticato.
    const { data: company, error: companyError } =
      await supabaseAdmin
        .from("companies")
        .select("id")
        .eq("claimed_by", user.id)
        .maybeSingle();

    if (companyError) {
      console.error(
        "Review reply company lookup error:",
        companyError
      );

      return NextResponse.json(
        { error: "Errore durante il recupero dell'impresa." },
        { status: 500 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { error: "Nessuna impresa collegata all'account." },
        { status: 403 }
      );
    }

    // Verifica che la recensione appartenga proprio a questa azienda.
    const { data: review, error: reviewError } =
      await supabaseAdmin
        .from("reviews")
        .select("id, company_id")
        .eq("id", reviewId)
        .maybeSingle();

    if (reviewError) {
      console.error(
        "Review reply review lookup error:",
        reviewError
      );

      return NextResponse.json(
        { error: "Errore durante il recupero della recensione." },
        { status: 500 }
      );
    }

    if (!review) {
      return NextResponse.json(
        { error: "Recensione non trovata." },
        { status: 404 }
      );
    }

    if (review.company_id !== company.id) {
      return NextResponse.json(
        {
          error:
            "Non puoi rispondere alle recensioni di un'altra impresa.",
        },
        { status: 403 }
      );
    }

    // Funzione disponibile solo alle aziende con PRO attivo.
    const { data: subscription, error: subscriptionError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("status")
        .eq("company_id", company.id)
        .maybeSingle();

    if (subscriptionError) {
      console.error(
        "Review reply subscription lookup error:",
        subscriptionError
      );

      return NextResponse.json(
        { error: "Errore durante la verifica dell'abbonamento." },
        { status: 500 }
      );
    }

    if (
      !subscription ||
      !["active", "trialing"].includes(subscription.status)
    ) {
      return NextResponse.json(
        {
          error:
            "La risposta alle recensioni è disponibile con EdilRate PRO.",
        },
        { status: 403 }
      );
    }

    // Una sola risposta per recensione.
    // Se esiste già, viene aggiornata.
    const { data: reply, error: replyError } =
      await supabaseAdmin
        .from("review_replies")
        .upsert(
          {
            review_id: review.id,
            company_id: company.id,
            content,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "review_id",
          }
        )
        .select(
          "id, review_id, company_id, content, created_at, updated_at"
        )
        .single();

    if (replyError) {
      console.error(
        "Review reply upsert error:",
        replyError
      );

      return NextResponse.json(
        { error: "Impossibile salvare la risposta." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Review reply POST error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}