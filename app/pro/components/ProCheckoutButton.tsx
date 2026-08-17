"use client";

import { supabase } from "@/src/lib/supabase";

type ProCheckoutButtonProps = {
  plan: "monthly" | "semiannual" | "annual";
  className?: string;
};

export default function ProCheckoutButton({
  plan,
  className = "",
}: ProCheckoutButtonProps) {
  const handleCheckout = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        alert("Devi accedere prima di attivare EdilRate PRO.");
        window.location.href = "/auth/login";
        return;
      }

      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert(data.error || "Impossibile avviare il pagamento.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Si è verificato un errore.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className={className}
    >
      Attiva EdilRate PRO
    </button>
  );
}