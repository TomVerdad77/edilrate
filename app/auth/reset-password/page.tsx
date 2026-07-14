"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/ui/Toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
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

  const updatePassword = async () => {
    if (!password || !confirmPassword) {
      showToast("Compila entrambi i campi password.", "error");
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
  
    const { error } = await supabase.auth.updateUser({
      password,
    });
  
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }
  
    setSuccess(true);
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

              <p className="mt-3 leading-7 text-gray-600">
                La password è stata aggiornata correttamente. Ora puoi accedere al tuo account.
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
              type="button"
              onClick={updatePassword}
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
              {loading ? "Aggiornamento..." : "Aggiorna password"}
            </button>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}