"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/ui/Toast";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const register = async () => {
    if (!fullName.trim()) {
      showToast("Inserisci il tuo nome e cognome.", "error");
      return;
    }
  
    if (!email.trim()) {
      showToast("Inserisci un indirizzo email.", "error");
      return;
    }
  
    if (password.length < 6) {
      showToast(
        "La password deve contenere almeno 6 caratteri.",
        "error"
      );
      return;
    }
  
    if (password !== confirmPassword) {
      showToast("Le password non coincidono.", "error");
      return;
    }
  
    setLoading(true);
  
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: window.location.origin,
      },
    });
  
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }
    
    window.location.href = "/auth/check-email";
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
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Conferma password"
            type="password"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

            <button
            type="button"
            onClick={register}
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {loading ? "Registrazione in corso..." : "Crea account"}
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