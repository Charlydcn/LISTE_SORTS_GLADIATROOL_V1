/* Historique chargé à la demande, via la vue publique sans auteur pour les invités. */
(function createHistoryService() {
  const state = { rows: [], offset: 0, hasMore: false, filters: null, classFilter: "", loading: false, requestId: 0 };

  function sourceTable() {
    return window.AppSession.isAdmin() ? "change_history" : "public_change_history";
  }

  async function fetchPage(filters, offset) {
    const size = window.APP_CONFIG.historyPageSize;
    let query = window.AppSupabase.client
      .from(sourceTable())
      .select("id,entity_type,entity_key,field_key,old_value,new_value,changed_at" + (window.AppSession.isAdmin() ? ",changed_by,changed_by_label" : ""));
    if (filters) {
      query = query
        .eq("entity_type", filters.entityType)
        .eq("entity_key", String(filters.entityKey))
        .eq("field_key", filters.fieldKey);
    } else if (state.classFilter) {
      const spells = state.classFilter === "Sorts communs" ? COMMON_SPELLS : SPELLS.filter((spell) => spell.classe === state.classFilter);
      const entityKeys = [...new Set(spells.map((spell) => String(spell.id)))];
      if (state.classFilter !== "Sorts communs") entityKeys.push(state.classFilter);
      query = query.in("entity_key", entityKeys);
    }
    query = query.order("changed_at", { ascending: false }).range(offset, offset + size - 1);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  function fieldLabel(field) {
    const labels = {
      nom: "Nom", pa: "PA", po: "PO", porteeModifiable: "Portée modifiable",
      lancerEnLigne: "Lancer en ligne", ligneDeVue: "Ligne de vue", cc: "Coup critique",
      ec: "Échec critique", relance: "Relance", parTour: "Lancers par tour",
      parCible: "Lancers par cible", "effets.normaux": "Effets normaux",
      "effets.critiques": "Effets critiques", vie: "PV", pm: "PM", vitalite: "Vitalité",
      sagesse: "Sagesse", force: "Force", intelligence: "Intelligence", chance: "Chance",
      agilite: "Agilité", initiative: "Initiative",
    };
    return labels[field] || field;
  }

  function valueText(value) {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    if (Array.isArray(value)) return value.length ? value.join("\n") : "(aucun effet)";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  }

  function contextLabel(row) {
    if (row.entity_type === "class_stat") return row.entity_key;
    const matches = [...SPELLS, ...COMMON_SPELLS].filter((spell) => String(spell.id) === String(row.entity_key));
    const spell = matches[0];
    if (!spell) return `Sort #${row.entity_key}`;
    const classes = [...new Set(matches.map((item) => item.classe))].join(" / ");
    return `${classes} · ${spell.nom}`;
  }

  function renderRows() {
    if (!state.rows.length) {
      const overrideStillExists = state.filters && window.AppStore.hasOverride(
        state.filters.entityType,
        state.filters.entityKey,
        state.filters.fieldKey,
      );
      if (overrideStillExists) {
        return '<p class="history-notice">Cette valeur est modifiée, mais son historique ne contient plus aucune ligne. Une ou plusieurs lignes ont pu être supprimées sans modifier la valeur actuelle.</p>';
      }
      return '<p class="empty-state">Aucune modification enregistrée.</p>';
    }
    return `<div class="history-list">${state.rows.map((row) => `
      <article class="history-entry" data-history-id="${window.escapeAttribute(row.id)}">
        <div class="history-entry-head">
          <div>
            <strong>${window.escapeHtml(contextLabel(row))}</strong>
            <span>${window.escapeHtml(fieldLabel(row.field_key))}</span>
          </div>
          ${window.AppSession.isAdmin() ? `<button type="button" class="danger-link" data-delete-history="${window.escapeAttribute(row.id)}" aria-label="Supprimer cette ligne d'historique">Supprimer</button>` : ""}
        </div>
        <div class="history-values">
          <div><small>Ancienne valeur</small><pre>${window.escapeHtml(valueText(row.old_value))}</pre></div>
          <span class="history-arrow" aria-hidden="true">→</span>
          <div><small>Nouvelle valeur</small><pre>${window.escapeHtml(valueText(row.new_value))}</pre></div>
        </div>
        <p class="history-meta">${window.escapeHtml(window.formatDate(row.changed_at))}${window.AppSession.isAdmin() ? ` · ${window.escapeHtml(row.changed_by_label || "Auteur inconnu")}` : ""}</p>
      </article>`).join("")}</div>`;
  }

  function renderClassFilter(disabled = false) {
    if (state.filters) return "";
    const options = ["", ...CLASSES, "Sorts communs"];
    return `<div class="history-filter">
      <label for="history-class-filter">Classe</label>
      <select id="history-class-filter" data-history-class-filter ${disabled ? "disabled" : ""}>
        ${options.map((className) => `<option value="${window.escapeAttribute(className)}" ${state.classFilter === className ? "selected" : ""}>${window.escapeHtml(className || "Toutes les classes")}</option>`).join("")}
      </select>
    </div>`;
  }

  function renderModalContent() {
    return `${renderClassFilter()}${renderRows()}${state.hasMore ? '<button type="button" class="secondary-button load-more" data-load-more-history>Charger plus</button>' : ""}`;
  }

  async function reload() {
    const requestId = ++state.requestId;
    state.rows = [];
    state.offset = 0;
    state.loading = true;
    const content = document.getElementById("modal-content");
    if (content) content.innerHTML = `${renderClassFilter(true)}<p class="loading-state">Chargement de l’historique…</p>`;
    try {
      const rows = await fetchPage(state.filters, 0);
      if (requestId !== state.requestId) return;
      state.rows = rows;
      state.offset = rows.length;
      state.hasMore = rows.length === window.APP_CONFIG.historyPageSize;
      document.getElementById("modal-content").innerHTML = renderModalContent();
    } catch (error) {
      if (requestId === state.requestId) document.getElementById("modal-content").innerHTML = `${renderClassFilter()}<p class="error-box">${window.escapeHtml(window.errorMessage(error))}</p>`;
    } finally {
      if (requestId === state.requestId) state.loading = false;
    }
  }

  async function open(filters = null, options = {}) {
    state.filters = filters;
    state.classFilter = filters ? "" : (options.classFilter || "");
    const title = filters ? `Historique — ${fieldLabel(filters.fieldKey)}` : "Historique global";
    window.AppModal.open(title, `${renderClassFilter(true)}<p class="loading-state">Chargement de l’historique…</p>`, { wide: true });
    await reload();
  }

  async function loadMore() {
    if (state.loading || !state.hasMore) return;
    state.loading = true;
    const button = document.querySelector("[data-load-more-history]");
    if (button) { button.disabled = true; button.textContent = "Chargement…"; }
    try {
      const rows = await fetchPage(state.filters, state.offset);
      state.rows.push(...rows);
      state.offset += rows.length;
      state.hasMore = rows.length === window.APP_CONFIG.historyPageSize;
      document.getElementById("modal-content").innerHTML = renderModalContent();
    } catch (error) {
      window.showToast(window.errorMessage(error), "error");
      if (button) { button.disabled = false; button.textContent = "Charger plus"; }
    } finally {
      state.loading = false;
    }
  }

  async function remove(id, button) {
    if (!window.AppSession.isAdmin()) return;
    button.disabled = true;
    button.textContent = "Suppression…";
    const { error } = await window.AppSupabase.client.from("change_history").delete().eq("id", id);
    if (error) {
      window.showToast(window.errorMessage(error), "error");
      button.disabled = false;
      button.textContent = "Supprimer";
      button.dataset.confirming = "false";
      button.classList.remove("confirming");
      return;
    }
    state.rows = state.rows.filter((row) => row.id !== id);
    document.getElementById("modal-content").innerHTML = renderModalContent();
    window.showToast("Ligne d’historique supprimée.", "success");
  }

  function confirmRemoval(button) {
    if (button.dataset.confirming === "true") {
      remove(button.dataset.deleteHistory, button);
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

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-load-more-history]")) loadMore();
    const deleteButton = event.target.closest("[data-delete-history]");
    if (deleteButton) confirmRemoval(deleteButton);
  });
  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-history-class-filter]")) return;
    state.classFilter = event.target.value;
    reload();
  });

  window.AppHistory = { open, fieldLabel, valueText };
})();
