import Footer from "@/components/Footer";
export default function ContattiPage() {
    return (
      <main className="min-h-screen bg-white text-black">
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold">Contatti</h1>
  
          <p className="mt-4 text-gray-600">
            Hai domande, suggerimenti o vuoi segnalare un problema?
            Contattaci tramite questa pagina.
          </p>
  
          <div className="mt-10 border rounded-3xl p-6">
            <p className="text-gray-700">
              Email: info@edilrate.it
            </p>
  
            <p className="mt-3 text-gray-700">
              Area iniziale: Friuli Venezia Giulia, con focus su Trieste.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }