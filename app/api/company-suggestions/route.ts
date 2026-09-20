import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_COMPANY_NAME_LENGTH = 150;
const MAX_CITY_LENGTH = 100;
const MAX_PROVINCE_LENGTH = 100;
const MAX_WEBSITE_LENGTH = 500;
const MAX_NOTES_LENGTH = 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const companyName =
      typeof body.companyName === "string"
        ? body.companyName.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const province =
      typeof body.province === "string"
        ? body.province.trim()
        : "";

    const website =
      typeof body.website === "string"
        ? body.website.trim()
        : "";

    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : "";

    if (!companyName || !city) {
      return NextResponse.json(
        { error: "Inserisci il nome dell'impresa e la città." },
        { status: 400 }
      );
    }

    if (
      companyName.length > MAX_COMPANY_NAME_LENGTH ||
      city.length > MAX_CITY_LENGTH ||
      province.length > MAX_PROVINCE_LENGTH ||
      website.length > MAX_WEBSITE_LENGTH ||
      notes.length > MAX_NOTES_LENGTH
    ) {
      return NextResponse.json(
        { error: "Uno o più campi superano la lunghezza consentita." },
        { status: 400 }
      );
    }

    if (website) {
      try {
        const url = new URL(website);

        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error("Invalid protocol");
        }
      } catch {
        return NextResponse.json(
          {
            error:
              "Inserisci un sito web valido, ad esempio https://esempio.it.",
          },
          { status: 400 }
        );
      }
    }

    const { error } = await supabaseAdmin
      .from("company_suggestions")
      .insert({
        company_name: companyName,
        city,
        province: province || null,
        website: website || null,
        notes: notes || null,
        status: "pending",
      });

    if (error) {
      console.error("Company suggestion insert error:", error);

      return NextResponse.json(
        { error: "Impossibile inviare la segnalazione." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Company suggestion API error:", error);

    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}
