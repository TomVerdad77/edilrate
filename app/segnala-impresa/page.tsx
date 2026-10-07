"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Toast from "@/components/ui/Toast";

export default function SegnalaImpresaPage() {
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] =
    useState<"success" | "error">("success");

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastType(type);
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const submitSuggestion = async () => {
    if (!companyName.trim() || !city.trim()) {
      showToast(
        "Inserisci il nome dell'impresa e la città.",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/company-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          city: city.trim(),
          province: province.trim(),
          website: website.trim(),
          email: email.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.error || "Impossibile inviare la segnalazione.",
          "error"
        );
        return;
      }

      const umami = (
        window as typeof window & {
          umami?: {
            track: (
              event: string,
              data?: Record<string, string | number | boolean>
            ) => void;
          };
        }
      ).umami;

      umami?.track("company_suggestion_submit");

      setSent(true);
      setCompanyName("");
      setCity("");
      setProvince("");
      setWebsite("");
      setEmail("");
      setNotes("");

      showToast("Impresa segnalata correttamente.");
    } catch (error) {
      console.error("Company suggestion error:", error);

      showToast(
        "Si è verificato un errore. Riprova.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />

      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <h1 className="text-4xl font-bold md:text-5xl">
          Non trovi la tua impresa?
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Segnalacela. Verificheremo le informazioni e faremo il
          possibile per aggiungerla a EdilRate entro 24 ore.
        </p>

        <div className="mt-10 space-y-5 rounded-3xl border p-6 md:p-8">
          {sent && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <p className="font-medium">
                Grazie per la segnalazione!
              </p>

              <p className="mt-1 text-sm">
                Verificheremo l&apos;impresa e faremo il possibile
                per aggiungerla a EdilRate entro 24 ore.
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nome impresa *
            </label>

            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Es. Impresa Rossi Srl"
              maxLength={150}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Città *
            </label>

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Es. Trieste"
              maxLength={100}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Provincia
            </label>

            <input
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Es. TS"
              maxLength={100}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Sito web
              <span className="ml-1 font-normal text-gray-500">
                (opzionale)
              </span>
            </label>

            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://esempio.it"
              type="url"
              maxLength={500}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              La tua email
              <span className="ml-1 font-normal text-gray-500">
                (opzionale)
              </span>
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@esempio.it"
              type="email"
              maxLength={254}
              autoComplete="email"
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
            />

            <p className="mt-2 text-sm text-gray-500">
              Inseriscila se vuoi essere avvisato quando l&apos;impresa
              sarà disponibile su EdilRate.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Altre informazioni
              <span className="ml-1 font-normal text-gray-500">
                (opzionale)
              </span>
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Indirizzo, attività svolta o altre informazioni utili..."
              rows={4}
              maxLength={1000}
              className="w-full resize-y rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
            />
          </div>

          <button
            type="button"
            onClick={submitSuggestion}
            disabled={loading}
            className="w-full rounded-2xl bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Invio in corso..." : "Segnala impresa"}
          </button>

          <p className="text-sm text-gray-500">
            I campi contrassegnati con * sono obbligatori.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}