"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async () => {
    if (!fullName.trim()) {
      alert("Inserisci il tuo nome.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Le password non coincidono.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/auth/check-email";
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center">
          Crea un account
        </h1>

        <p className="mt-4 text-center text-gray-600">
          Registrati gratuitamente su EdilRate.
        </p>

        <div className="mt-10 border rounded-3xl p-6 space-y-4">

          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nome e cognome"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Conferma password"
            type="password"
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            onClick={register}
            className="w-full bg-black text-white rounded-xl px-4 py-3 hover:bg-gray-800 transition"
          >
            Crea account
          </button>

          <p className="text-center text-sm text-gray-600">
            Hai già un account?{" "}
            <a
              href="/auth/login"
              className="underline"
            >
              Accedi
            </a>
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}