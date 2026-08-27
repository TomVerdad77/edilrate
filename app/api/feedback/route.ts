import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 3000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const subject =
      typeof body.subject === "string" ? body.subject.trim() : "";

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    // Il messaggio è l'unico campo obbligatorio
    if (!message) {
      return NextResponse.json(
        { error: "Inserisci un messaggio." },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      subject.length > MAX_SUBJECT_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: "Uno o più campi superano la lunghezza consentita." },
        { status: 400 }
      );
    }

    // Se viene fornita un'email, deve essere valida
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Inserisci un indirizzo email valido." },
          { status: 400 }
        );
      }
    }

    const { error } = await supabaseAdmin
      .from("feedback")
      .insert({
        user_id: null,
        name: name || null,
        email: email || null,
        user_type: "guest",
        subject: subject || null,
        message,
        status: "new",
      });

    if (error) {
      console.error("Feedback insert error:", error);

      return NextResponse.json(
        { error: "Impossibile inviare il feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback API error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}