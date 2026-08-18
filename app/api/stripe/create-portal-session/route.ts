import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/src/lib/stripe";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Utente non autenticato" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Client usato SOLO per verificare il token dell'utente
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
        { error: "Sessione non valida" },
        { status: 401 }
      );
    }

    // Da qui usiamo il client server-only.
    // La sicurezza viene dal fatto che cerchiamo SOLO
    // l'azienda rivendicata dall'utente appena verificato.
    const { data: company, error: companyError } =
      await supabaseAdmin
        .from("companies")
        .select("id")
        .eq("claimed_by", user.id)
        .maybeSingle();

    if (companyError) {
      console.error("Company lookup error:", companyError);

      return NextResponse.json(
        { error: "Errore durante il recupero dell'impresa" },
        { status: 500 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { error: "Nessuna impresa collegata" },
        { status: 403 }
      );
    }

    const { data: subscription, error: subscriptionError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("stripe_customer_id, status")
        .eq("company_id", company.id)
        .maybeSingle();

    if (subscriptionError) {
      console.error(
        "Subscription lookup error:",
        subscriptionError
      );

      return NextResponse.json(
        { error: "Errore durante il recupero dell'abbonamento" },
        { status: 500 }
      );
    }

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Nessun abbonamento Stripe trovato" },
        { status: 404 }
      );
    }

    const origin = new URL(request.url).origin;

    const portalSession =
      await stripe.billingPortal.sessions.create({
        customer: subscription.stripe_customer_id,
        return_url: `${origin}/dashboard`,
      });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Stripe portal error:", error);

    return NextResponse.json(
      { error: "Impossibile aprire la gestione dell'abbonamento" },
      { status: 500 }
    );
  }
}