"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Toast from "@/components/ui/Toast";


export default function FeedbackPage() {
  const [type, setType] = useState("Suggerimento");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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

  const submitFeedback = async () => {
    if (!message.trim()) {
      showToast("Inserisci un messaggio.", "error");
      return;
    }
  
    setLoading(true);
  
    const { error } = await supabase.from("feedback").insert({
      subject: type,
      name: name.trim() || null,
      email: email.trim() || null,
      message: message.trim(),
      status: "new",
      user_type: "guest",
    });
  
    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }
  
    setSent(true);
    setType("Suggerimento");
    setName("");
    setEmail("");
    setMessage("");
    setLoading(false);
  
    showToast("Feedback inviato correttamente.");
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <Toast
  message={toastMessage}
  type={toastType}
  onClose={() => setToastMessage("")}
/>

<Navbar />
      <section className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold">
        Aiutaci a migliorare EdilRate
      </h1>

      <p className="mt-6 text-lg leading-8 text-gray-600">
        Hai trovato un problema, hai un suggerimento o vorresti vedere una nuova funzionalità?
        Ogni feedback viene letto dal team EdilRate e ci aiuta a migliorare la piattaforma.
      </p>

        <div className="mt-10 border rounded-3xl p-6 md:p-8 space-y-5">
          {sent && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
            <p className="font-medium">
              🎉 Grazie per il tuo contributo!
            </p>

            <p className="mt-1 text-sm">
              Ogni suggerimento viene letto dal team EdilRate e ci aiuta a migliorare continuamente la piattaforma.
            </p>
          </div>
          )}

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          >
            <option>Suggerimento</option>
            <option>Segnalazione bug</option>
            <option>Richiesta nuova funzione</option>
            <option>Partnership</option>
            <option>Domanda generale</option>
          </select>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (opzionale)"
            type="email"
            className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Scrivi qui il tuo feedback..."
            rows={6}
            className="w-full resize-y rounded-xl border px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />

<button
  type="button"
  onClick={submitFeedback}
  disabled={loading}
  className="w-full rounded-2xl bg-black px-6 py-4 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
>
  {loading ? "Invio in corso..." : "Invia feedback"}
</button>
        </div>
      </section>

      <Footer />
    </main>
  );
}