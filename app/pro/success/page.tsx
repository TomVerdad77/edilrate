import Button from "@/components/ui/Button";

export const metadata = {
  title: "EdilRate PRO attivato",
  description: "Il tuo abbonamento EdilRate PRO è stato attivato con successo.",
};

export default function ProSuccessPage() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6 py-16">
      <section className="max-w-2xl text-center">
        <img
          src="/logo-edilrate.png"
          alt="EdilRate"
          className="h-20 w-auto mx-auto object-contain"
        />

        <div className="mt-10 inline-flex items-center rounded-full border bg-gray-50 px-4 py-2 text-sm font-medium">
          ⭐ EdilRate PRO
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          Benvenuto in EdilRate PRO
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Il tuo abbonamento è stato attivato correttamente.
          Da questo momento puoi utilizzare tutte le funzionalità PRO
          disponibili per la tua impresa.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/dashboard">
            Vai alla Gestione Profilo
          </Button>

          <Button href="/pro" variant="secondary">
            Torna a EdilRate PRO
          </Button>
        </div>
      </section>
    </main>
  );
}