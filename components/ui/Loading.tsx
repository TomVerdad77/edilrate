type LoadingProps = {
    text?: string;
  };
  
  export default function Loading({
    text = "Caricamento...",
  }: LoadingProps) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="bg-white border rounded-3xl p-10 shadow-sm text-center max-w-sm w-full">
          <div className="animate-spin text-5xl">🏗️</div>
  
          <h2 className="mt-6 text-2xl font-semibold">
            {text}
          </h2>
  
          <p className="mt-3 text-gray-500">
            Attendi qualche istante.
          </p>
        </div>
      </main>
    );
  }