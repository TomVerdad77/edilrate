"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendResetEmail = async () => {
    if (!email.trim()) {
      alert("Inserisci la tua email.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/reset-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <main className="min-h-screen bg-white text-black">
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

              <p className="mt-3 text-gray-600">
                Controlla la tua casella di posta e clicca sul link ricevuto.
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
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                onClick={sendResetEmail}
                className="w-full bg-black text-white rounded-xl px-4 py-3 hover:bg-gray-800 transition"
              >
                Invia link di recupero
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