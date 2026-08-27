import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 30;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const companyId =
      typeof body.company_id === "string" ? body.company_id.trim() : "";

    const customerName =
      typeof body.customer_name === "string"
        ? body.customer_name.trim()
        : "";

    const customerEmail =
      typeof body.customer_email === "string"
        ? body.customer_email.trim().toLowerCase()
        : "";

    const customerPhone =
      typeof body.customer_phone === "string"
        ? body.customer_phone.trim()
        : "";

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    // Campi obbligatori
    if (
      !companyId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !message
    ) {
      return NextResponse.json(
        { error: "Compila tutti i campi richiesti." },
        { status: 400 }
      );
    }

    // Limiti di lunghezza
    if (
      customerName.length > MAX_NAME_LENGTH ||
      customerEmail.length > MAX_EMAIL_LENGTH ||
      customerPhone.length > MAX_PHONE_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: "Uno o più campi superano la lunghezza consentita." },
        { status: 400 }
      );
    }

    // Controllo email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: "Inserisci un indirizzo email valido." },
        { status: 400 }
      );
    }

    // Controllo UUID company_id
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(companyId)) {
      return NextResponse.json(
        { error: "Impresa non valida." },
        { status: 400 }
      );
    }

    // Verifica che l'impresa esista realmente
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("id", companyId)
      .maybeSingle();

    if (companyError) {
      console.error("Quote company lookup error:", companyError);

      return NextResponse.json(
        { error: "Impossibile verificare l'impresa." },
        { status: 500 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { error: "Impresa non trovata." },
        { status: 404 }
      );
    }

    // Inserimento server-side.
    // status NON arriva dal browser:
    // viene impostato esplicitamente dal server.
    const { error: insertError } = await supabaseAdmin
      .from("quote_requests")
      .insert({
        company_id: companyId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        message,
        status: "pending",
      });

    if (insertError) {
      console.error("Quote insert error:", insertError);

      return NextResponse.json(
        { error: "Impossibile inviare la richiesta di preventivo." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote API error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}