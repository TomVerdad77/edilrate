import Button from "@/components/ui/Button";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
      <Navbar />
      <section className="max-w-2xl text-center">
        <img
          src="/logo-edilrate.png"
          alt="EdilRate"
          className="h-20 w-auto mx-auto object-contain"
        />

        <p className="mt-10 text-sm text-gray-500">
          Errore 404
        </p>

        <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
          Pagina non trovata
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          La pagina che stai cercando non esiste oppure è stata spostata.
          Puoi tornare alla Home o esplorare le aziende presenti su EdilRate.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/">
            Torna alla Home
          </Button>

          <Button href="/imprese" variant="secondary">
            Cerca un’impresa
          </Button>
        </div>
      </section>
    </main>
  );
}