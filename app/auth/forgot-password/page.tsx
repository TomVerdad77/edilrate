"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

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

  const sendResetEmail = async () => {
    if (!email.trim()) {
      showToast("Inserisci il tuo indirizzo email.", "error");
      return;
    }
  
    setLoading(true);
  
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }
    );
  
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }
  
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Toast
  message={toastMessage}
  type={toastType}
  onClose={() => setToastMessage("")}
  />
      <Navbar />

      <section className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center">
          Recupera password
        </h1>

        <p className="mt-4 text-center text-gray-600">
          Inserisci la tua email e ti invieremo un link per reimpostare la password.
        </p>

        <div className="mt-10 border rounded-3xl p-6 space-y-4">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl">📧</div>

              <h2 className="mt-5 text-2xl font-semibold">
                Email inviata
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Se l’indirizzo inserito è associato a un account, riceverai un’email con
                il link per reimpostare la password.
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Controlla anche la cartella Spam o Posta indesiderata.
              </p>

              <a
                href="/auth/login"
                className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-xl"
              >
                Torna al login
              </a>
            </div>
          ) : (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
              />

            <button
              type="button"
              onClick={sendResetEmail}
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Invio in corso..." : "Invia link di recupero"}
            </button>

              <p className="text-center text-sm text-gray-600">
                Ti è tornata in mente?{" "}
                <a href="/auth/login" className="underline">
                  Accedi
                </a>
              </p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}