type ToastProps = {
    message: string;
    type?: "success" | "error";
    onClose?: () => void;
  };
  
  export default function Toast({
    message,
    type = "success",
    onClose,
  }: ToastProps) {
    if (!message) return null;
  
    return (
      <div
  className={`fixed top-6 right-6 z-[100] w-[calc(100%-3rem)] max-w-sm rounded-2xl border bg-white p-5 shadow-xl ${
    type === "success"
      ? "border-green-200"
      : "border-red-200"
  }`}
>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
          <div
  className={`flex h-8 w-8 items-center justify-center rounded-full ${
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {type === "success" ? "✓" : "!"}
</div>
  
            <div>
            <p className="font-semibold text-black">
  {type === "success" ? "Operazione completata" : "Si è verificato un errore"}
</p>
  
              <p className="mt-1 text-sm text-gray-600">
                {message}
              </p>
            </div>
          </div>
  
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 transition hover:text-black"
              aria-label="Chiudi notifica"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }