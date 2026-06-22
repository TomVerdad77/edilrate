export default function Footer() {
    return (
      <footer className="border-t mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
            <img src="/logo-edilrate.png" alt="EdilRate" className="h-10 w-auto" />
  
              <p className="mt-2 text-sm text-gray-600">
                La piattaforma dedicata alle imprese edili del Friuli Venezia Giulia.
              </p>
            </div>
  
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <a href="/chi-siamo" className="hover:text-black">
                Chi siamo
              </a>
  
              <a href="/privacy" className="hover:text-black">
                Privacy
              </a>
  
              <a href="/termini" className="hover:text-black">
                Termini
              </a>
  
              <a href="/cookie" className="hover:text-black">
                Cookie
              </a>
  
              <a href="/contatti" className="hover:text-black">
                Contatti
              </a>
            </div>
          </div>
  
          <div className="mt-8 pt-8 border-t text-sm text-gray-500">
            © {new Date().getFullYear()} EdilRate. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    );
  }