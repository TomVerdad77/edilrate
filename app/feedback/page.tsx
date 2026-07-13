"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Footer from "@/components/Footer";

export default function FeedbackPage() {
  const [type, setType] = useState("Suggerimento");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!message.trim()) {
      alert("Inserisci un messaggio.");
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

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
    setType("Suggerimento");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold">Feedback</h1>

        <p className="mt-6 text-lg text-gray-600">
          Aiutaci a migliorare EdilRate. Puoi inviare suggerimenti,
          segnalare problemi o proporre nuove funzionalità.
        </p>

        <div className="mt-10 border rounded-3xl p-6 md:p-8 space-y-5">
          {sent && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4">
              Grazie! Il tuo feedback è stato inviato correttamente.
            </div>
          )}

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option>Suggerimento</option>
            <option>Segnalazione bug</option>
            <option>Richiesta nuova funzione</option>
            <option>Partnership</option>
            <option>Altro</option>
          </select>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome (opzionale)"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (opzionale)"
            className="w-full border rounded-xl px-4 py-3"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Scrivi qui il tuo feedback..."
            rows={6}
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            onClick={submitFeedback}
            disabled={loading}
            className="bg-black text-white px-6 py-4 rounded-2xl disabled:opacity-50"
          >
            {loading ? "Invio in corso..." : "Invia feedback"}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}