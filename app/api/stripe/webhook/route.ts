import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature error:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const companyId = session.metadata?.company_id;
        const plan = session.metadata?.plan;

        if (!companyId || !plan) {
          throw new Error("Missing checkout metadata");
        }

        if (!session.subscription || !session.customer) {
          throw new Error("Missing Stripe subscription or customer");
        }

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer.id;

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .upsert(
            {
              company_id: companyId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price.id ?? null,
              plan,
              status: subscription.status,
              current_period_end: subscription.items.data[0]?.current_period_end
  ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
  : null,
            },
            {
              onConflict: "company_id",
            }
          );

        if (error) {
          throw error;
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const companyId = subscription.metadata?.company_id;
        const plan = subscription.metadata?.plan;

        if (!companyId) {
          break;
        }

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            stripe_price_id: subscription.items.data[0]?.price.id ?? null,
            plan: plan ?? undefined,
            status: subscription.status,
            current_period_end: subscription.items.data[0]?.current_period_end
  ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
  : null,
          })
          .eq("company_id", companyId);

        if (error) {
          throw error;
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const companyId = subscription.metadata?.company_id;

        if (!companyId) {
          break;
        }

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("company_id", companyId);

        if (error) {
          throw error;
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}