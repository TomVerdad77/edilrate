"use client";

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
      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert("Impossibile avviare il pagamento.");
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