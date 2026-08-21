import { useEffect, useRef } from "react";
import { useModalStore } from "../lib/modalStore";

export function Modal() {
  const title = useModalStore((s) => s.title);
  const wide = useModalStore((s) => s.wide);
  const content = useModalStore((s) => s.content);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!content) return;
    document.body.classList.add("modal-open");
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") useModalStore.getState().close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [content]);

  return (
    <div id="modal-root">
      {content ? (
        <div
          className="modal-backdrop"
          data-modal-backdrop
          onClick={() => useModalStore.getState().close()}
        >
          <section
            className={`modal-dialog ${wide ? "modal-wide" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <h2 id="modal-title">{title}</h2>
              <button
                type="button"
                className="icon-button"
                data-modal-close
                aria-label="Fermer"
                ref={closeRef}
                onClick={() => useModalStore.getState().close()}
              >
                ×
              </button>
            </header>
            <div className="modal-content" id="modal-content">
              {content}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
