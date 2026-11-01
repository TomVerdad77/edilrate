
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_COMPANY_NAME_LENGTH = 150;
const MAX_CITY_LENGTH = 100;
const MAX_PROVINCE_LENGTH = 100;
const MAX_WEBSITE_LENGTH = 500;
const MAX_EMAIL_LENGTH = 254;
const MAX_NOTES_LENGTH = 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char] ?? char;
  });
}

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

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
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
      email.length > MAX_EMAIL_LENGTH ||
      notes.length > MAX_NOTES_LENGTH
    ) {
      return NextResponse.json(
        {
          error: "Uno o più campi superano la lunghezza consentita.",
        },
        { status: 400 }
      );
    }

    if (website) {
      try {
        const url = new URL(website);

        if (
          url.protocol !== "http:" &&
          url.protocol !== "https:"
        ) {
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

    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Inserisci un indirizzo email valido." },
        { status: 400 }
      );
    }

    // 1. Salvataggio della segnalazione
    const { error } = await supabaseAdmin
      .from("company_suggestions")
      .insert({
        company_name: companyName,
        city,
        province: province || null,
        website: website || null,
        email: email || null,
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

    // 2. Notifica email all'amministratore
    // Un eventuale errore email non annulla il salvataggio.
    try {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
      const resendApiKey = process.env.RESEND_API_KEY;

      if (!adminEmail || !resendApiKey) {
        console.error(
          "Company suggestion notification: missing email configuration."
        );
      } else {
        const resend = new Resend(resendApiKey);

        const details = [
          ["Nome impresa", companyName],
          ["Città", city],
          ["Provincia", province],
          ["Sito web", website],
          ["Email segnalante", email],
          ["Altre informazioni", notes],
        ];

        const detailsHtml = details
          .filter(([, value]) => Boolean(value))
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; vertical-align: top;">
                  ${escapeHtml(label)}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; white-space: pre-wrap; overflow-wrap: anywhere;">
                  ${escapeHtml(value)}
                </td>
              </tr>
            `
          )
          .join("");

        const { error: emailError } =
          await resend.emails.send({
            from: "EdilRate <info@edilrate.it>",
            to: adminEmail,
            subject: `EdilRate - Nuova impresa segnalata: ${companyName.replace(/[\r\n]/g, " ")}`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 650px; margin: 0 auto;">
                <h2>Nuova impresa segnalata su EdilRate</h2>

                <p>
                  È stata ricevuta una nuova segnalazione
                  di un'impresa mancante.
                </p>

                <table style="width: 100%; border-collapse: collapse;">
                  ${detailsHtml}
                </table>

                <p style="margin-top: 28px;">
                  <a
                    href="https://edilrate.it/admin"
                    style="background: #111827; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;"
                  >
                    Apri ADMIN EdilRate
                  </a>
                </p>

                <p style="font-size: 13px; color: #6b7280;">
                  Questa è una notifica automatica.
                  La segnalazione è stata salvata su EdilRate.
                </p>
              </div>
            `,
          });

        if (emailError) {
          console.error(
            "Company suggestion notification error:",
            emailError
          );
        }
      }
    } catch (notificationError) {
      console.error(
        "Company suggestion notification exception:",
        notificationError
      );
    }

    // 3. Conferma all'utente
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
