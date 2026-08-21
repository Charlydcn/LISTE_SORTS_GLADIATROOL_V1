/* Les commentaires ne sont appelés et rendus que pour une session authentifiée. */
(function createCommentsService() {
  let activeSpellId = null;

  async function list(spellId) {
    if (!window.AppSession.isAdmin()) return;
    activeSpellId = String(spellId);
    const target = document.querySelector(`[data-comments-for="${CSS.escape(String(spellId))}"]`);
    if (!target) return;
    target.innerHTML = '<p class="loading-state">Chargement des commentaires…</p>';
    const { data, error } = await window.AppSupabase.client
      .from("spell_comments")
      .select("*")
      .eq("spell_id", String(spellId))
      .order("created_at", { ascending: false });
    if (activeSpellId !== String(spellId) || !target.isConnected) return;
    if (error) {
      target.innerHTML = `<p class="error-box">${window.escapeHtml(window.errorMessage(error))}</p>`;
      return;
    }
    render(target, data || [], spellId);
  }

  function render(target, comments, spellId) {
    target.innerHTML = `
      <form class="comment-form" data-comment-create="${window.escapeAttribute(spellId)}">
        <label for="new-comment-${window.escapeAttribute(spellId)}">Ajouter un commentaire</label>
        <textarea id="new-comment-${window.escapeAttribute(spellId)}" name="body" rows="3" required maxlength="10000"></textarea>
        <button type="submit" class="primary-button">Publier</button>
      </form>
      <div class="comment-list">
        ${comments.length ? comments.map(commentHtml).join("") : '<p class="empty-state">Aucun commentaire.</p>'}
      </div>`;
  }

  function commentHtml(comment) {
    const edited = comment.updated_at && new Date(comment.updated_at).getTime() > new Date(comment.created_at).getTime() + 1000;
    return `<article class="comment" data-comment-id="${window.escapeAttribute(comment.id)}">
      <div class="comment-head">
        <strong>${window.escapeHtml(comment.created_by_label || "Auteur inconnu")}</strong>
        <div class="comment-actions">
          <button type="button" class="text-button" data-edit-comment>Modifier</button>
          <button type="button" class="danger-link" data-delete-comment>Supprimer</button>
        </div>
      </div>
      <p class="comment-meta">Créé le ${window.escapeHtml(window.formatDate(comment.created_at))}${edited ? `<br>Modifié le ${window.escapeHtml(window.formatDate(comment.updated_at))}${comment.updated_by_label ? ` par ${window.escapeHtml(comment.updated_by_label)}` : ""}` : ""}</p>
      <p class="comment-body">${window.escapeHtml(comment.body).replace(/\n/g, "<br>")}</p>
    </article>`;
  }

  async function create(form) {
    const body = form.elements.body.value.trim();
    if (!body) return;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    const { error } = await window.AppSupabase.client.from("spell_comments").insert({ spell_id: form.dataset.commentCreate, body });
    if (error) {
      window.showToast(window.errorMessage(error), "error");
      button.disabled = false;
      return;
    }
    await list(form.dataset.commentCreate);
    window.showToast("Commentaire ajouté.", "success");
  }

  function beginEdit(article) {
    const body = article.querySelector(".comment-body").innerText;
    article.querySelector(".comment-body").outerHTML = `
      <form class="comment-edit-form">
        <label class="sr-only">Modifier le commentaire</label>
        <textarea name="body" rows="4" required maxlength="10000">${window.escapeHtml(body)}</textarea>
        <div class="editor-actions"><button type="submit" class="primary-button">Enregistrer</button><button type="button" class="secondary-button" data-cancel-comment>Annuler</button></div>
      </form>`;
    article.querySelector("textarea").focus();
  }

  async function update(form) {
    const article = form.closest("[data-comment-id]");
    const body = form.elements.body.value.trim();
    if (!body) return;
    const { error } = await window.AppSupabase.client.from("spell_comments").update({ body }).eq("id", article.dataset.commentId);
    if (error) { window.showToast(window.errorMessage(error), "error"); return; }
    await list(activeSpellId);
    window.showToast("Commentaire modifié.", "success");
  }

  async function remove(article, button) {
    button.disabled = true;
    button.textContent = "Suppression…";
    const { error } = await window.AppSupabase.client.from("spell_comments").delete().eq("id", article.dataset.commentId);
    if (error) {
      window.showToast(window.errorMessage(error), "error");
      button.disabled = false;
      button.textContent = "Supprimer";
      button.dataset.confirming = "false";
      return;
    }
    await list(activeSpellId);
    window.showToast("Commentaire supprimé.", "success");
  }

  function confirmRemoval(button, article) {
    if (button.dataset.confirming === "true") {
      remove(article, button);
      return;
    }
    button.dataset.confirming = "true";
    button.textContent = "Vraiment ?";
    button.classList.add("confirming");
    window.setTimeout(() => {
      if (!button.isConnected || button.dataset.confirming !== "true") return;
      button.dataset.confirming = "false";
      button.textContent = "Supprimer";
      button.classList.remove("confirming");
    }, 4000);
  }

  document.addEventListener("submit", (event) => {
    if (event.target.matches("[data-comment-create]")) { event.preventDefault(); create(event.target); }
    if (event.target.matches(".comment-edit-form")) { event.preventDefault(); update(event.target); }
  });
  document.addEventListener("click", (event) => {
    const article = event.target.closest("[data-comment-id]");
    if (event.target.closest("[data-edit-comment]") && article) beginEdit(article);
    const deleteButton = event.target.closest("[data-delete-comment]");
    if (deleteButton && article) confirmRemoval(deleteButton, article);
    if (event.target.closest("[data-cancel-comment]")) list(activeSpellId);
  });

  window.AppComments = { list };
})();
