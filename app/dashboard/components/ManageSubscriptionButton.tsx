"use client";

import { supabase } from "@/src/lib/supabase";

export default function ManageSubscriptionButton() {
  const handlePortal = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert("Devi accedere per gestire l'abbonamento.");
        return;
      }

      const response = await fetch(
        "/api/stripe/create-portal-session",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert(
          data.error ||
            "Impossibile aprire la gestione dell'abbonamento."
        );
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Si è verificato un errore.");
    }
  };

  return (
    <button
      type="button"
      onClick={handlePortal}
      className="rounded-2xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
    >
      Gestisci abbonamento
    </button>
  );
}