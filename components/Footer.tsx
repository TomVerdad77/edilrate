import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <img
              src="/logo-edilrate.png"
              alt="EdilRate"
              className="h-10 w-auto"
            />

            <p className="mt-2 text-sm text-gray-600">
              Trova imprese edili affidabili, leggi recensioni e richiedi
              preventivi in Friuli Venezia Giulia.
            </p>
          </div>

          <nav
            aria-label="Link nel footer"
            className="flex flex-wrap gap-6 text-sm text-gray-600"
          >
            <Link href="/chi-siamo" className="transition hover:text-black">
              Chi siamo
            </Link>

            <Link href="/privacy" className="transition hover:text-black">
              Privacy
            </Link>

            <Link href="/termini" className="transition hover:text-black">
              Termini
            </Link>

            <Link href="/cookie" className="transition hover:text-black">
              Cookie
            </Link>

            <Link href="/contatti" className="transition hover:text-black">
              Contatti
            </Link>

            <Link href="/feedback" className="transition hover:text-black">
              Feedback
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t pt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} EdilRate. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}