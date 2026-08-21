/* Historique chargé à la demande, via la vue publique sans auteur pour les invités. */
(function createHistoryService() {
  const SPELL_FIELDS = ["nom", "pa", "po", "porteeModifiable", "lancerEnLigne", "ligneDeVue", "cc", "ec", "relance", "parTour", "parCible", "effets.normaux", "effets.critiques"];
  const CLASS_STAT_FIELDS = ["vie", "pa", "pm", "vitalite", "sagesse", "force", "intelligence", "chance", "agilite", "initiative"];
  const FIELD_LABELS = {
    nom: "Nom", pa: "PA", po: "PO", porteeModifiable: "Portée modifiable",
    lancerEnLigne: "Lancer en ligne", ligneDeVue: "Ligne de vue", cc: "Coup critique",
    ec: "Échec critique", relance: "Relance", parTour: "Lancers par tour",
    parCible: "Lancers par cible", "effets.normaux": "Effets normaux",
    "effets.critiques": "Effets critiques", vie: "PV", pm: "PM", vitalite: "Vitalité",
    sagesse: "Sagesse", force: "Force", intelligence: "Intelligence", chance: "Chance",
    agilite: "Agilité", initiative: "Initiative",
  };
  const state = { rows: [], offset: 0, hasMore: false, filters: null, classFilter: "", search: "", loading: false, requestId: 0 };
  let searchTimer = null;

  function sourceTable() {
    return window.AppSession.isAdmin() ? "change_history" : "public_change_history";
  }

  function normalizeSearch(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
  }

  function includesSearchToken(haystack, token) {
    if (token.length > 2) return haystack.includes(token);
    return haystack.split(/[^a-z0-9]+/).includes(token);
  }

  function classEntityKeys(classFilter) {
    if (!classFilter) return null;
    const spells = classFilter === "Sorts communs" ? COMMON_SPELLS : SPELLS.filter((spell) => spell.classe === classFilter);
    const keys = [...new Set(spells.map((spell) => String(spell.id)))];
    if (classFilter !== "Sorts communs") keys.push(classFilter);
    return keys;
  }

  function searchFilters(search, classFilter) {
    const tokens = normalizeSearch(search).split(/\s+/).filter(Boolean);
    if (!tokens.length) return null;
    const spellPool = classFilter === "Sorts communs"
      ? COMMON_SPELLS
      : classFilter
        ? SPELLS.filter((spell) => spell.classe === classFilter)
        : [...SPELLS, ...COMMON_SPELLS];
    const entities = spellPool.map((spell) => ({
      key: String(spell.id),
      context: `${spell.nom} ${spell.classe} sort ${spell.id}`,
      fields: SPELL_FIELDS,
    }));
    const statClasses = classFilter === "Sorts communs" ? [] : classFilter ? [classFilter] : CLASSES;
    statClasses.forEach((className) => entities.push({
      key: className,
      context: `${className} caractéristiques statistiques classe`,
      fields: CLASS_STAT_FIELDS,
    }));

    const entityKeys = new Set();
    const fieldKeys = new Set();
    entities.forEach((entity) => entity.fields.forEach((fieldKey) => {
      const haystack = normalizeSearch(`${entity.context} ${fieldKey} ${fieldLabel(fieldKey)}`);
      if (!tokens.every((token) => includesSearchToken(haystack, token))) return;
      entityKeys.add(entity.key);
      fieldKeys.add(fieldKey);
    }));
    return { entityKeys: [...entityKeys], fieldKeys: [...fieldKeys] };
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
    } else if (state.search) {
      const filtersForSearch = searchFilters(state.search, state.classFilter);
      if (!filtersForSearch.entityKeys.length || !filtersForSearch.fieldKeys.length) return [];
      query = query.in("entity_key", filtersForSearch.entityKeys).in("field_key", filtersForSearch.fieldKeys);
    } else if (state.classFilter) {
      query = query.in("entity_key", classEntityKeys(state.classFilter));
    }
    query = query.order("changed_at", { ascending: false }).range(offset, offset + size - 1);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  function fieldLabel(field) {
    return FIELD_LABELS[field] || field;
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
        return '<p class="history-notice">Cette valeur est modifiée, mais son historique ne contient plus aucune ligne. Des lignes ont pu être supprimées avant que le journal d’audit devienne immuable.</p>';
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
        </div>
        <div class="history-values">
          <div><small>Ancienne valeur</small><pre>${window.escapeHtml(valueText(row.old_value))}</pre></div>
          <span class="history-arrow" aria-hidden="true">→</span>
          <div><small>Nouvelle valeur</small><pre>${window.escapeHtml(valueText(row.new_value))}</pre></div>
        </div>
        <p class="history-meta">${window.escapeHtml(window.formatDate(row.changed_at))}${window.AppSession.isAdmin() ? ` · ${window.escapeHtml(row.changed_by_label || "Auteur inconnu")}` : ""}</p>
      </article>`).join("")}</div>`;
  }

  function renderHistoryControls(disabled = false) {
    if (state.filters) return "";
    const options = ["", ...CLASSES, "Sorts communs"];
    return `<div class="history-controls">
      <div class="history-filter">
        <label for="history-class-filter">Classe</label>
        <select id="history-class-filter" data-history-class-filter ${disabled ? "disabled" : ""}>
          ${options.map((className) => `<option value="${window.escapeAttribute(className)}" ${state.classFilter === className ? "selected" : ""}>${window.escapeHtml(className || "Toutes les classes")}</option>`).join("")}
        </select>
      </div>
      <div class="history-search">
        <label class="sr-only" for="history-search">Rechercher dans l’historique</label>
        <input id="history-search" type="search" data-history-search value="${window.escapeAttribute(state.search)}" placeholder="Rechercher un sort, une classe, une propriété…" autocomplete="off">
      </div>
    </div>`;
  }

  function renderResults() {
    return `${renderRows()}${state.hasMore ? '<button type="button" class="secondary-button load-more" data-load-more-history>Charger plus</button>' : ""}`;
  }

  function renderModalContent() {
    return `${renderHistoryControls()}<div id="history-results">${renderResults()}</div>`;
  }

  async function reload() {
    const requestId = ++state.requestId;
    state.rows = [];
    state.offset = 0;
    state.loading = true;
    const content = document.getElementById("modal-content");
    const existingResults = document.getElementById("history-results");
    if (existingResults) {
      existingResults.innerHTML = '<p class="loading-state">Chargement de l’historique…</p>';
    } else if (content) {
      content.innerHTML = `${renderHistoryControls(true)}<div id="history-results"><p class="loading-state">Chargement de l’historique…</p></div>`;
    }
    try {
      const rows = await fetchPage(state.filters, 0);
      if (requestId !== state.requestId) return;
      state.rows = rows;
      state.offset = rows.length;
      state.hasMore = rows.length === window.APP_CONFIG.historyPageSize;
      const results = document.getElementById("history-results");
      if (results) results.innerHTML = renderResults();
      else document.getElementById("modal-content").innerHTML = renderModalContent();
    } catch (error) {
      if (requestId === state.requestId) {
        const results = document.getElementById("history-results");
        if (results) results.innerHTML = `<p class="error-box">${window.escapeHtml(window.errorMessage(error))}</p>`;
      }
    } finally {
      if (requestId === state.requestId) {
        state.loading = false;
        const classSelect = document.querySelector("[data-history-class-filter]");
        if (classSelect) classSelect.disabled = false;
      }
    }
  }

  async function open(filters = null, options = {}) {
    state.filters = filters;
    state.classFilter = filters ? "" : (options.classFilter || "");
    state.search = "";
    const title = filters ? `Historique — ${fieldLabel(filters.fieldKey)}` : "Historique global";
    window.AppModal.open(title, `${renderHistoryControls(true)}<div id="history-results"><p class="loading-state">Chargement de l’historique…</p></div>`, { wide: true });
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
      document.getElementById("history-results").innerHTML = renderResults();
    } catch (error) {
      window.showToast(window.errorMessage(error), "error");
      if (button) { button.disabled = false; button.textContent = "Charger plus"; }
    } finally {
      state.loading = false;
    }
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-load-more-history]")) loadMore();
  });
  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-history-class-filter]")) return;
    state.classFilter = event.target.value;
    reload();
  });
  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-history-search]")) return;
    state.search = event.target.value;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => reload(), 250);
  });

  window.AppHistory = { open, fieldLabel, valueText };
})();
