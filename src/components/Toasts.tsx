import { useToastStore } from "../lib/toastStore";

export function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div id="toast-root" className="toast-root" aria-live="assertive">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
