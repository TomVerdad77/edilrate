"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const updatePassword = async () => {
    if (password !== confirmPassword) {
      alert("Le password non coincidono.");
      return;
    }

    if (password.length < 6) {
      alert("La password deve contenere almeno 6 caratteri.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center">
          Nuova password
        </h1>

        <p className="mt-4 text-center text-gray-600">
          Inserisci la tua nuova password.
        </p>

        <div className="mt-10 border rounded-3xl p-6 space-y-4">
          {success ? (
            <div className="text-center">
              <div className="text-5xl">✅</div>

              <h2 className="mt-5 text-2xl font-semibold">
                Password aggiornata
              </h2>

              <p className="mt-3 text-gray-600">
                La tua password è stata modificata con successo.
              </p>

              <a
                href="/auth/login"
                className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-xl"
              >
                Vai al login
              </a>
            </div>
          ) : (
            <>
              <input
                type="password"
                placeholder="Nuova password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="password"
                placeholder="Conferma password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                onClick={updatePassword}
                className="w-full bg-black text-white rounded-xl px-4 py-3 hover:bg-gray-800 transition"
              >
                Aggiorna password
              </button>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}