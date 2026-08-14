import { NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";

const priceMap = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  semiannual: process.env.STRIPE_PRICE_SEMIANNUAL,
  annual: process.env.STRIPE_PRICE_ANNUAL,
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const plan = body.plan as keyof typeof priceMap;
    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: "Piano non valido" },
        { status: 400 }
      );
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${origin}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pro?checkout=cancelled`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Impossibile avviare il pagamento" },
      { status: 500 }
    );
  }
}