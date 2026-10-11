"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentChoice = "accepted" | "rejected";

const STORAGE_KEY = "edilrate-cookie-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateGoogleConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  const gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer.push(args);
    };

  window.gtag = gtag;

  const granted = choice === "accepted" ? "granted" : "denied";

  gtag("consent", "update", {
    ad_storage: granted,
    analytics_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY);

    if (savedConsent === "accepted" || savedConsent === "rejected") {
      updateGoogleConsent(savedConsent);
      setHasChoice(true);
      return;
    }

    setVisible(true);
  }, []);

  function handleChoice(choice: ConsentChoice) {
    localStorage.setItem(STORAGE_KEY, choice);
    updateGoogleConsent(choice);

    setHasChoice(true);
    setVisible(false);
  }

  function openPreferences() {
    setVisible(true);
  }

  return (
    <>
      {visible && (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
          <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-900">
                  La tua privacy su EdilRate
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Utilizziamo tecnologie necessarie al funzionamento del sito e,
                  con il tuo consenso, tecnologie di misurazione e pubblicitarie
                  per comprendere l&apos;utilizzo di EdilRate e migliorare le
                  nostre campagne.
                </p>

                <Link
                  href="/cookie"
                  className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Leggi la Cookie Policy
                </Link>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleChoice("rejected")}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Rifiuta
                </button>

                <button
                  type="button"
                  onClick={() => handleChoice("accepted")}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Accetta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!visible && hasChoice && (
        <button
          type="button"
          onClick={openPreferences}
          className="fixed bottom-4 left-4 z-[90] rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-md transition hover:bg-gray-50"
        >
          Gestisci cookie
        </button>
      )}
    </>
  );
}