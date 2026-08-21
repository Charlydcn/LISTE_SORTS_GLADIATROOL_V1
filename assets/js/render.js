/* Rendu, navigation par hash et délégation d'événements de l'application vanilla. */
const DEFAULT_ICON_SVG = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z"/>
  </svg>`;

let selectedSpellId = null;
let selectedSpellClass = null;
let commonOpen = false;
let collaborationWarning = "";
const activeEffectTabs = new Map();

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function errorMessage(error) {
  if (!error) return "Une erreur inattendue est survenue.";
  if (/invalid login credentials/i.test(error.message || "")) return "Email ou mot de passe incorrect.";
  return error.message || String(error);
}

function formatDate(value) {
  if (!value) return "date inconnue";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date).replace(",", " à");
}

function showToast(message, type = "info") {
  const root = document.getElementById("toast-root");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  root.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4500);
}

Object.assign(window, { escapeHtml, escapeAttribute, errorMessage, formatDate, showToast });

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function checkOrCross(value) {
  return value
    ? '<span class="stat-icon yes" aria-label="Oui">✓</span>'
    : '<span class="stat-icon no" aria-label="Non">✗</span>';
}

function elementIconFor(text) {
  if (!/(Dommages|Dommage|Vole)/.test(text)) return "";
  const match = text.match(/\((Eau|Terre|Air|Feu|Neutre)\)/);
  if (!match) return "";
  const files = { Eau: "WaterDamage.svg", Terre: "EarthDamage.svg", Air: "AirDamage.svg", Feu: "FireDamage.svg", Neutre: "NeutralDamage.svg" };
  return `<img class="element" src="assets/img/icons/${files[match[1]]}" alt="${match[1]}">`;
}

function buildEffectRows(effects, tab, minRows = 5) {
  const rows = effects.filter((effect) => effect.onglet === tab);
  const html = rows.map((effect) => `<div class="effect-row">${elementIconFor(effect.texte)}<span>${escapeHtml(effect.texte)}</span></div>`);
  while (html.length < minRows) html.push('<div class="effect-row empty" aria-hidden="true">&nbsp;</div>');
  return html.join("");
}

function spellIconHtml(spell) {
  return spell.icone
    ? `<img class="spell-icon-img" src="${escapeAttribute(spell.icone)}" alt="${escapeAttribute(spell.nom)}" loading="lazy">`
    : DEFAULT_ICON_SVG;
}

function classIconHtml(className) {
  const url = CLASS_ICONS[className];
  return url
    ? `<img class="class-icon-img" src="${escapeAttribute(url)}" alt="${escapeAttribute(className)}" loading="lazy">`
    : DEFAULT_ICON_SVG;
}

function historyIconHtml() {
  return `<svg class="history-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5"></circle>
    <path d="M12 7.5V12l3.2 2"></path>
  </svg>`;
}

function editableField(entityType, entityKey, fieldKey, valueHtml, inputType = "text", extraClass = "") {
  const override = window.AppStore.getOverride(entityType, entityKey, fieldKey);
  const changedClass = override ? "is-overridden" : "";
  const attrs = `data-entity-type="${escapeAttribute(entityType)}" data-entity-key="${escapeAttribute(entityKey)}" data-field-key="${escapeAttribute(fieldKey)}" data-input-type="${escapeAttribute(inputType)}"`;
  const trigger = window.AppSession.isAdmin()
    ? `<button type="button" class="editable-trigger" data-editable ${attrs} aria-label="Modifier ${escapeAttribute(window.AppHistory.fieldLabel(fieldKey))}">${valueHtml}</button>`
    : `<span class="field-value">${valueHtml}</span>`;
  const history = override
    ? `<button type="button" class="field-history" data-property-history ${attrs} aria-label="Voir l'historique de ${escapeAttribute(window.AppHistory.fieldLabel(fieldKey))}">${historyIconHtml()}</button>`
    : "";
  return `<span class="editable-field ${changedClass} ${extraClass}">${trigger}${history}</span>`;
}

function editableEffects(spell, tab) {
  const fieldKey = `effets.${tab}`;
  const override = window.AppStore.getOverride("spell", spell.id, fieldKey);
  const attrs = `data-entity-type="spell" data-entity-key="${spell.id}" data-field-key="${fieldKey}" data-input-type="textarea"`;
  const rows = buildEffectRows(spell.effets, tab);
  const trigger = window.AppSession.isAdmin()
    ? `<div class="editable-trigger effects-edit-trigger" role="button" tabindex="0" data-editable ${attrs} aria-label="Modifier les effets ${tab}">${rows}</div>`
    : `<div class="field-value">${rows}</div>`;
  const history = override ? `<button type="button" class="field-history effects-history" data-property-history ${attrs}>${historyIconHtml()} <span>Historique</span></button>` : "";
  return `<div class="editable-field effects-editable ${override ? "is-overridden" : ""}">${trigger}${history}</div>`;
}

function statRow(label, entityKey, fieldKey, value, inputType = "text") {
  const html = inputType === "boolean" ? checkOrCross(value) : escapeHtml(displayValue(value));
  return `<div class="stat-row"><span class="stat-label">${escapeHtml(label)}</span>${editableField("spell", entityKey, fieldKey, html, inputType)}</div>`;
}

function resetButton(scope, key, overrideCount) {
  if (!window.AppSession.isAdmin()) return "";
  return `<button type="button" class="reset-button" data-reset-scope="${escapeAttribute(scope)}" data-reset-key="${escapeAttribute(key)}" ${overrideCount ? "" : "disabled"}>Réinitialiser</button>`;
}

function buildCommentsSection(spellId) {
  if (!window.AppSession.isAdmin()) return "";
  return `<section class="comments-section"><h3>Commentaires</h3><div data-comments-for="${spellId}"><p class="loading-state">Chargement des commentaires…</p></div></section>`;
}

function buildCard(spell) {
  const tab = activeEffectTabs.get(String(spell.id)) || "normaux";
  const overrideCount = window.AppStore.listOverrides({ entityType: "spell", entityKeys: [spell.id] }).length;
  return `<div class="spell-card" data-spell="${spell.id}">
    <div class="spell-header">
      <div class="spell-header-left">
        <div class="spell-icon">${spellIconHtml(spell)}</div>
        <div class="spell-name-block">${editableField("spell", spell.id, "nom", escapeHtml(spell.nom), "text", "spell-name")}</div>
      </div>
      <div class="spell-cost">
        <div class="po">${editableField("spell", spell.id, "po", `${escapeHtml(spell.po)} PO`, "text")}</div>
        <div class="pa">${editableField("spell", spell.id, "pa", `${escapeHtml(spell.pa)} PA`, "number")}</div>
      </div>
    </div>
    <div class="spell-card-actions">${resetButton("spell", spell.id, overrideCount)}</div>
    <div class="section-heading">Effets</div>
    <div class="effect-tabs" role="tablist" aria-label="Type d'effets">
      <button type="button" class="effect-tab ${tab === "normaux" ? "active" : ""}" data-onglet="normaux" role="tab" aria-selected="${tab === "normaux"}">Normaux</button>
      <button type="button" class="effect-tab ${tab === "critiques" ? "active" : ""}" data-onglet="critiques" role="tab" aria-selected="${tab === "critiques"}">Critiques</button>
    </div>
    <div class="effects-box">${editableEffects(spell, tab)}</div>
    <div class="section-heading">Autres caractéristiques</div>
    <div class="stats-wrap"><div class="stats-grid">
      <div class="stats-col left">
        ${statRow("Probabilité de coup critique", spell.id, "cc", spell.cc)}
        ${statRow("Probabilité d'échec", spell.id, "ec", spell.ec)}
        ${statRow("Nb. de lancers par tour", spell.id, "parTour", spell.parTour, "nullable-number")}
        ${statRow("Nb. de lancers par cible", spell.id, "parCible", spell.parCible, "nullable-number")}
        ${statRow("Nb. de tours entre deux lancers", spell.id, "relance", spell.relance)}
      </div>
      <div class="stats-col right">
        ${statRow("Portée modifiable", spell.id, "porteeModifiable", spell.porteeModifiable, "boolean")}
        ${statRow("Ligne de vue", spell.id, "ligneDeVue", spell.ligneDeVue, "boolean")}
        ${statRow("Lancer en ligne", spell.id, "lancerEnLigne", spell.lancerEnLigne, "boolean")}
      </div>
    </div></div>
    ${buildCommentsSection(spell.id)}
  </div>`;
}

function buildSpellTile(spell) {
  const selected = String(selectedSpellId) === String(spell.id) && selectedSpellClass === spell.classe;
  const hasActiveOverride = window.AppStore.listOverrides({ entityType: "spell", entityKeys: [spell.id] }).length > 0;
  return `<button type="button" class="spell-tile ${selected ? "selected" : ""} ${hasActiveOverride ? "is-overridden" : ""}" data-spell="${spell.id}" data-spell-class="${escapeAttribute(spell.classe)}">
    <div class="spell-tile-icon">${spellIconHtml(spell)}</div>
    <span class="spell-tile-name">${escapeHtml(spell.nom)}</span>
  </button>`;
}

function renderHeader() {
  const root = document.getElementById("app-header");
  if (window.AppSession.mode === "login" || window.AppSession.mode === "loading") { root.replaceChildren(); return; }
  const identity = window.AppSession.isAdmin()
    ? `<span class="session-identity">${escapeHtml(window.AppSession.user?.email || "Administrateur")}</span>`
    : '<span class="session-identity guest">Mode invité</span>';
  root.innerHTML = `<nav class="app-toolbar" aria-label="Actions de session">
    ${identity}
    <button type="button" class="toolbar-button" data-global-history>Historique</button>
    <button type="button" class="toolbar-button" data-leave-session>${window.AppSession.isAdmin() ? "Déconnexion" : "Se connecter"}</button>
  </nav>`;
}

function renderWarning() {
  return collaborationWarning ? `<div class="warning-banner" role="alert">${escapeHtml(collaborationWarning)}</div>` : "";
}

function renderHome() {
  const commonTiles = COMMON_SPELLS.map(buildSpellTile).join("");
  document.getElementById("app").innerHTML = `${renderWarning()}
    <div class="class-grid">${CLASSES.map((className) => {
      const count = SPELLS.filter((spell) => spell.classe === className).length;
      return `<a class="class-link" href="#/classe/${encodeURIComponent(className)}">
        <div class="class-link-icon">${classIconHtml(className)}</div>
        <span class="class-link-name">${escapeHtml(className)}</span>
        <span class="class-link-count">${count} sorts</span>
      </a>`;
    }).join("")}</div>
    <div class="common-section">
      <button type="button" class="common-toggle ${commonOpen ? "open" : ""}" aria-expanded="${commonOpen}"><span class="common-chevron">▾</span> Sorts communs</button>
      <div class="common-body" ${commonOpen ? "" : "hidden"}>
        <div class="class-layout"><div class="spell-grid">${commonTiles}</div><aside class="spell-detail" id="common-spell-detail"><div class="detail-placeholder">Sélectionne un sort pour voir ses détails.</div></aside></div>
      </div>
    </div>`;
  renderSelectedDetail();
}

const STAT_DEFINITIONS = [
  ["vie", "PV", "PV.svg"], ["pa", "PA", "PA.svg"], ["pm", "PM", "PM.svg"], ["initiative", "Initiative", "Ini.svg"],
  ["vitalite", "Vitalité", "Vita.svg"], ["sagesse", "Sagesse", "Wisdom.svg"], ["force", "Force", "EarthDamage.svg"],
  ["intelligence", "Intelligence", "FireDamage.svg"], ["chance", "Chance", "WaterDamage.svg"], ["agilite", "Agilité", "AirDamage.svg"],
];

function buildClassStatsTable(className) {
  const stats = MORPH_STATS[className];
  if (!stats) return "";
  const overrideCount = window.AppStore.listOverrides({ entityType: "class_stat", entityKeys: [className] }).length;
  return `<section class="class-stats-section"><div class="panel-heading-row"><h3 class="class-stats-title">Caractéristiques</h3>${resetButton("class-stats", className, overrideCount)}</div>
    <div class="class-stats-table">
      <div class="stat-row-cell stat-row-header"><span class="stat-cell-icon-wrap"></span><span class="stat-cell-label">Caractéristique</span><span class="stat-cell-sep"></span><span class="stat-cell-value">Valeur</span></div>
      ${STAT_DEFINITIONS.map(([key, label, icon]) => `<div class="stat-row-cell">
        <span class="stat-cell-icon-wrap"><img class="stat-cell-icon" src="assets/img/icons/${icon}" alt=""></span>
        <span class="stat-cell-label">${label}</span><span class="stat-cell-sep"></span>
        <span class="stat-cell-value">${editableField("class_stat", className, key, escapeHtml(displayValue(stats[key])), "number")}</span>
      </div>`).join("")}
    </div></section>`;
}

function renderClass(className) {
  const spells = SPELLS.filter((spell) => spell.classe === className);
  const spellIds = spells.map((spell) => spell.id);
  const overrideCount = window.AppStore.listOverrides({ entityType: "spell", entityKeys: spellIds }).length;
  document.getElementById("app").innerHTML = `${renderWarning()}<div class="class-page">
    <a class="back-link" href="#/">← Toutes les classes</a>
    <h2 class="class-heading"><span class="class-heading-icon">${classIconHtml(className)}</span>${escapeHtml(className)}<span class="class-count">(${spells.length} sorts)</span></h2>
    <div class="panel-heading-row spells-panel-heading"><h3>Sorts</h3>${resetButton("class-spells", className, overrideCount)}</div>
    <div class="class-layout"><div class="spell-grid">${spells.map(buildSpellTile).join("")}</div><aside class="spell-detail" id="spell-detail"><div class="detail-placeholder">Sélectionne un sort pour voir ses détails.</div></aside></div>
    ${buildClassStatsTable(className)}
  </div>`;
  renderSelectedDetail();
}

function getRoute() {
  const match = location.hash.replace(/^#/, "").match(/^\/classe\/(.+)$/);
  if (match) {
    const className = decodeURIComponent(match[1]);
    if (CLASSES.includes(className)) return { view: "class", className };
  }
  return { view: "home" };
}

function renderApp() {
  renderHeader();
  const route = getRoute();
  if (route.view === "class") renderClass(route.className);
  else renderHome();
}

function renderSelectedDetail() {
  if (selectedSpellId === null) return;
  const route = getRoute();
  const expectedClass = route.view === "class" ? route.className : "Sorts communs";
  const spell = [...SPELLS, ...COMMON_SPELLS].find((item) => String(item.id) === String(selectedSpellId) && item.classe === expectedClass);
  if (!spell) return;
  const detail = document.getElementById(route.view === "class" ? "spell-detail" : "common-spell-detail");
  if (!detail) return;
  detail.innerHTML = buildCard(spell);
  if (window.AppSession.isAdmin()) window.AppComments.list(spell.id);
}

function renderLogin(message = "") {
  selectedSpellId = null;
  selectedSpellClass = null;
  collaborationWarning = "";
  renderHeader();
  document.getElementById("app").innerHTML = `<main class="login-shell">
    <section class="login-card" aria-labelledby="login-title">
      <div class="login-emblem">${DEFAULT_ICON_SVG}</div>
      <h1 id="login-title">Accès Gladiatrool</h1>
      <p>Connectez-vous pour administrer les sorts.</p>
      ${message ? `<div class="error-box" role="alert">${escapeHtml(message)}</div>` : ""}
      <form id="login-form">
        <label for="login-email">Email</label><input id="login-email" name="email" type="email" autocomplete="username" required>
        <label for="login-password">Mot de passe</label><input id="login-password" name="password" type="password" autocomplete="current-password" required>
        <button type="submit" class="primary-button">Se connecter</button>
      </form>
      <button type="button" class="guest-link" data-enter-guest>Consulter en tant qu’invité</button>
    </section>
  </main>`;
}

async function startApplication() {
  document.getElementById("app").innerHTML = '<p class="app-loading">Chargement des données…</p>';
  renderHeader();
  await window.AppData.loadBaselineData();
  try {
    await window.AppStore.initialize();
    collaborationWarning = "";
  } catch (error) {
    window.AppData.resetEffective();
    collaborationWarning = "Supabase est indisponible : les valeurs JSON sont affichées, mais elles peuvent ne pas représenter l’état collaboratif actuel.";
    console.error(error);
  }
  renderApp();
}

function refreshView() {
  renderApp();
}

function beginEdit(trigger) {
  if (!window.AppSession.isAdmin()) return;
  const wrapper = trigger.closest(".editable-field");
  if (!wrapper || wrapper.querySelector(".inline-editor")) return;
  const { entityType, entityKey, fieldKey, inputType } = trigger.dataset;
  const current = window.AppStore.getEffectiveValue(entityType, entityKey, fieldKey);
  let control;
  if (inputType === "boolean") {
    control = `<select class="inline-input" aria-label="Nouvelle valeur"><option value="true" ${current === true ? "selected" : ""}>Oui</option><option value="false" ${current === false ? "selected" : ""}>Non</option></select>`;
  } else if (inputType === "textarea") {
    control = `<textarea class="inline-input" rows="7" aria-label="Nouvelle valeur">${escapeHtml((current || []).join("\n"))}</textarea>`;
  } else {
    const type = inputType.includes("number") ? "number" : "text";
    control = `<input class="inline-input" type="${type}" value="${escapeAttribute(current ?? "")}" aria-label="Nouvelle valeur" ${inputType === "number" ? "required" : ""}>`;
  }
  wrapper.innerHTML = `<span class="inline-editor" data-entity-type="${escapeAttribute(entityType)}" data-entity-key="${escapeAttribute(entityKey)}" data-field-key="${escapeAttribute(fieldKey)}" data-input-type="${escapeAttribute(inputType)}">
    ${control}<span class="editor-actions"><button type="button" class="save-edit">Enregistrer</button><button type="button" class="cancel-edit">Annuler</button></span><span class="save-status" aria-live="polite"></span>
  </span>`;
  wrapper.querySelector(".inline-input").focus();
}

function parseEditorValue(editor) {
  const control = editor.querySelector(".inline-input");
  const type = editor.dataset.inputType;
  if (type === "boolean") return control.value === "true";
  if (type === "textarea") return control.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (type === "number" || type === "nullable-number") {
    if (type === "nullable-number" && control.value.trim() === "") return null;
    const number = Number(control.value);
    if (!Number.isFinite(number)) throw new Error("Saisissez un nombre valide.");
    return number;
  }
  return control.value.trim();
}

async function saveEditor(editor) {
  const status = editor.querySelector(".save-status");
  const buttons = editor.querySelectorAll("button");
  try {
    const value = parseEditorValue(editor);
    buttons.forEach((button) => { button.disabled = true; });
    status.textContent = "Enregistrement…";
    const result = await window.AppStore.save(editor.dataset.entityType, editor.dataset.entityKey, editor.dataset.fieldKey, value);
    showToast(result.changed ? "Modification enregistrée." : "Valeur inchangée.", "success");
    refreshView();
  } catch (error) {
    buttons.forEach((button) => { button.disabled = false; });
    status.textContent = errorMessage(error);
    status.classList.add("save-error");
  }
}

function overridesForReset(button) {
  const scope = button.dataset.resetScope;
  const key = button.dataset.resetKey;
  if (scope === "spell") {
    return window.AppStore.listOverrides({ entityType: "spell", entityKeys: [key] });
  }
  if (scope === "class-spells") {
    const spellIds = SPELLS.filter((spell) => spell.classe === key).map((spell) => spell.id);
    return window.AppStore.listOverrides({ entityType: "spell", entityKeys: spellIds });
  }
  if (scope === "class-stats") {
    return window.AppStore.listOverrides({ entityType: "class_stat", entityKeys: [key] });
  }
  return [];
}

async function performReset(button) {
  const rows = overridesForReset(button);
  if (!rows.length) { refreshView(); return; }
  button.disabled = true;
  button.textContent = "Réinitialisation…";
  button.classList.remove("confirming");
  try {
    const count = await window.AppStore.reset(rows);
    showToast(`${count} valeur${count > 1 ? "s" : ""} réinitialisée${count > 1 ? "s" : ""}.`, "success");
    refreshView();
  } catch (error) {
    button.disabled = false;
    button.dataset.confirming = "false";
    button.textContent = "Réinitialiser";
    showToast(errorMessage(error), "error");
  }
}

function confirmReset(button) {
  if (button.dataset.confirming === "true") {
    performReset(button);
    return;
  }
  button.dataset.confirming = "true";
  button.textContent = "Vraiment ?";
  button.classList.add("confirming");
  window.setTimeout(() => {
    if (!button.isConnected || button.dataset.confirming !== "true") return;
    button.dataset.confirming = "false";
    button.textContent = "Réinitialiser";
    button.classList.remove("confirming");
  }, 4000);
}

document.addEventListener("click", async (event) => {
  const enterGuest = event.target.closest("[data-enter-guest]");
  if (enterGuest) {
    window.AppSession.enterGuest();
    await startApplication();
    return;
  }
  const leave = event.target.closest("[data-leave-session]");
  if (leave) {
    leave.disabled = true;
    try { await window.AppSession.leave(); renderLogin(); }
    catch (error) { leave.disabled = false; showToast(errorMessage(error), "error"); }
    return;
  }
  const reset = event.target.closest("[data-reset-scope]");
  if (reset) { confirmReset(reset); return; }
  if (event.target.closest("[data-global-history]")) {
    const route = getRoute();
    window.AppHistory.open(null, { classFilter: route.view === "class" ? route.className : "" });
    return;
  }
  const propertyHistory = event.target.closest("[data-property-history]");
  if (propertyHistory) {
    window.AppHistory.open({ entityType: propertyHistory.dataset.entityType, entityKey: propertyHistory.dataset.entityKey, fieldKey: propertyHistory.dataset.fieldKey });
    return;
  }
  const editable = event.target.closest("[data-editable]");
  if (editable) { beginEdit(editable); return; }
  const save = event.target.closest(".save-edit");
  if (save) { saveEditor(save.closest(".inline-editor")); return; }
  if (event.target.closest(".cancel-edit")) { refreshView(); return; }
  const toggle = event.target.closest(".common-toggle");
  if (toggle) { commonOpen = !commonOpen; renderHome(); return; }
  const tab = event.target.closest(".effect-tab");
  if (tab) {
    const card = tab.closest(".spell-card");
    activeEffectTabs.set(card.dataset.spell, tab.dataset.onglet);
    renderSelectedDetail();
    return;
  }
  const tile = event.target.closest(".spell-tile");
  if (tile) {
    selectedSpellId = tile.dataset.spell;
    selectedSpellClass = tile.dataset.spellClass;
    document.querySelectorAll(".spell-tile").forEach((item) => item.classList.toggle("selected", item === tile));
    renderSelectedDetail();
  }
});

document.addEventListener("keydown", (event) => {
  const editable = event.target.closest("[data-editable]");
  if (editable && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); beginEdit(editable); return; }
  const editor = event.target.closest(".inline-editor");
  if (!editor) return;
  if (event.key === "Escape") { event.preventDefault(); refreshView(); }
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") { event.preventDefault(); saveEditor(editor); }
  if (event.key === "Enter" && event.target.tagName === "TEXTAREA" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); saveEditor(editor); }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id !== "login-form") return;
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Connexion…";
  try {
    await window.AppSession.signIn(form.elements.email.value.trim(), form.elements.password.value);
    await startApplication();
  } catch (error) {
    renderLogin(errorMessage(error));
  }
});

window.addEventListener("hashchange", () => {
  selectedSpellId = null;
  selectedSpellClass = null;
  if (window.AppSession.mode === "admin" || window.AppSession.mode === "guest") renderApp();
});

(async function bootstrap() {
  try {
    await window.AppSession.initialize();
    if (window.AppSession.mode === "admin" || window.AppSession.mode === "guest") await startApplication();
    else renderLogin(window.AppSupabase.initializationError ? window.AppSupabase.initializationError.message : "");
  } catch (error) {
    renderLogin(`Impossible de vérifier la session Supabase : ${errorMessage(error)}`);
  }
})();
