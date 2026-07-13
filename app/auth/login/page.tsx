"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:3000" },
    });
  };

  const loginWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: "http://localhost:3000" },
    });
  };

  const loginWithEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center">Accedi</h1>

        <p className="mt-4 text-center text-gray-600">
          Entra nel tuo account EdilRate.
        </p>

        <div className="mt-10 border rounded-3xl p-6 space-y-4">
          <button
            onClick={loginWithGoogle}
            className="w-full border rounded-xl px-4 py-3 hover:bg-gray-100 transition"
          >
            Accedi con Google
          </button>

          <button
            onClick={loginWithFacebook}
            className="w-full border rounded-xl px-4 py-3 hover:bg-gray-100 transition"
          >
            Accedi con Facebook
          </button>

          <div className="py-2 text-center text-sm text-gray-400">
            oppure
          </div>

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

          <button
            onClick={loginWithEmail}
            className="w-full bg-black text-white rounded-xl px-4 py-3 hover:bg-gray-800 transition"
          >
            Accedi
          </button>

          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>
              <a href="/auth/forgot-password" className="underline">
                Hai dimenticato la password?
              </a>
            </p>

            <p>
              Non hai un account?{" "}
              <a href="/auth/register" className="underline">
                Registrati
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}