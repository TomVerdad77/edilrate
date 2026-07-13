import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckEmailPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl">📧</div>

        <h1 className="mt-8 text-4xl font-bold">
          Controlla la tua email
        </h1>

        <p className="mt-5 text-gray-600 leading-7">
          Ti abbiamo inviato un link di conferma. Apri la tua casella email e
          clicca sul link per attivare il tuo account EdilRate.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Torna alla Home
          </a>

          <a
            href="/auth/login"
            className="border px-6 py-3 rounded-xl"
          >
            Vai al login
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}