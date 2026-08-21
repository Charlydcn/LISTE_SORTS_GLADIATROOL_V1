/* Une seule implémentation de modale pour tous les historiques. */
(function createModal() {
  let previousFocus = null;

  function close() {
    const root = document.getElementById("modal-root");
    if (!root.firstElementChild) return;
    root.replaceChildren();
    document.body.classList.remove("modal-open");
    if (previousFocus?.isConnected) previousFocus.focus();
  }

  function open(title, contentHtml, options = {}) {
    previousFocus = document.activeElement;
    const root = document.getElementById("modal-root");
    root.innerHTML = `
      <div class="modal-backdrop" data-modal-backdrop>
        <section class="modal-dialog ${options.wide ? "modal-wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header class="modal-header">
            <h2 id="modal-title">${window.escapeHtml(title)}</h2>
            <button type="button" class="icon-button" data-modal-close aria-label="Fermer">×</button>
          </header>
          <div class="modal-content" id="modal-content">${contentHtml}</div>
        </section>
      </div>`;
    document.body.classList.add("modal-open");
    root.querySelector("[data-modal-close]").focus();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) close();
    if (event.target.matches("[data-modal-backdrop]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.querySelector(".modal-backdrop")) close();
  });

  window.AppModal = { open, close };
})();
