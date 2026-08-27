import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/src/lib/stripe";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

const priceMap = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  semiannual: process.env.STRIPE_PRICE_SEMIANNUAL,
  annual: process.env.STRIPE_PRICE_ANNUAL,
} as const;

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Sessione non valida" },
        { status: 401 }
      );
    }

    const body = await request.json();

const allowedPlans = [
  "monthly",
  "semiannual",
  "annual",
] as const;

type Plan = (typeof allowedPlans)[number];

const plan =
  typeof body.plan === "string" &&
  allowedPlans.includes(body.plan as Plan)
    ? (body.plan as Plan)
    : null;

if (!plan) {
  return NextResponse.json(
    { error: "Piano non valido" },
    { status: 400 }
  );
}

const priceId = priceMap[plan];

if (!priceId) {
  return NextResponse.json(
    { error: "Piano non configurato" },
    { status: 500 }
  );
}

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, name, claimed_by")
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
        {
          error:
            "Devi avere un'impresa rivendicata prima di attivare EdilRate PRO",
        },
        { status: 403 }
      );
    }

    const { data: existingSubscription, error: subscriptionError } =
  await supabaseAdmin
    .from("subscriptions")
      .select("status")
      .eq("company_id", company.id)
      .maybeSingle();
  
  if (subscriptionError) {
    console.error(
      "Subscription lookup error:",
      subscriptionError
    );
  
    return NextResponse.json(
      { error: "Errore durante il controllo dell'abbonamento" },
      { status: 500 }
    );
  }
  
  if (
    existingSubscription?.status === "active" ||
    existingSubscription?.status === "trialing"
  ) {
    return NextResponse.json(
      {
        error:
          "Hai già un abbonamento EdilRate PRO attivo.",
      },
      { status: 409 }
    );
  }

    const origin = new URL(request.url).origin;

    const checkoutSession =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        customer_email: user.email,

        metadata: {
          company_id: company.id,
          user_id: user.id,
          plan,
        },

        subscription_data: {
          metadata: {
            company_id: company.id,
            user_id: user.id,
            plan,
          },
        },

        success_url: `${origin}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pro?checkout=cancelled`,
      });

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Impossibile avviare il pagamento" },
      { status: 500 }
    );
  }
}