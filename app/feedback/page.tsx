"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("user");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submitFeedback = async () => {
    const { error } = await supabase.from("feedback").insert({
      name,
      email,
      user_type: userType,
      subject,
      message,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setUserType("user");
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold">Feedback e suggerimenti</h1>

        <p className="mt-4 text-gray-600">
          Aiutaci a migliorare EdilRate. Puoi inviare suggerimenti,
          segnalazioni o idee per nuove funzionalità.
        </p>

        <div className="mt-10 border rounded-3xl p-6 space-y-4">
          {sent ? (
            <p className="text-green-700">
              Grazie! Il tuo feedback è stato inviato correttamente.
            </p>
          ) : (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full border rounded-xl px-4 py-3"
              />

              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="user">Cliente / utente</option>
                <option value="company">Impresa</option>
              </select>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Oggetto"
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Scrivi il tuo messaggio..."
                className="w-full border rounded-xl px-4 py-3 h-36"
              />

              <button
                onClick={submitFeedback}
                className="bg-black text-white px-6 py-3 rounded-xl"
              >
                Invia feedback
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}