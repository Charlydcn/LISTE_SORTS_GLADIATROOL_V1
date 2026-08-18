/* ==========================================================================
   RENDU DES SORTS
   - Page d'accueil : 12 liens (1 par classe) + section "Sorts communs"
   - Page classe    : les sorts de la classe sélectionnée
   Lit CLASSES, SPELLS et COMMON_SPELLS (data.js).
   Navigation par hash : #/ (accueil) et #/classe/<nom>
   ========================================================================== */

const DEFAULT_ICON_SVG = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z"/>
  </svg>
`;

function checkOrCross(bool){
  return bool
    ? `<span class="stat-icon yes">&#10003;</span>`
    : `<span class="stat-icon no">&#10007;</span>`;
}

function displayValue(v){
  return (v === null || v === undefined || v === "")
    ? "-"
    : String(v);
}

/* ---- icône d'élément pour les dégâts / vol de vie élémentaires ---- */
function elementIconFor(texte){
  const m = texte.match(/^(Dommage|Vol de vie)\s+(Eau|Terre|Air|Feu|Neutre)/);
  if (!m) return "";
  const files = {
    "Eau": "WaterDamage.svg",
    "Terre": "EarthDamage.svg",
    "Air": "AirDamage.svg",
    "Feu": "FireDamage.svg",
    "Neutre": "NeutralDamage.svg",
  };
  return `<img class="element" src="assets/img/icons/${files[m[2]]}" height="80%" alt="${m[2]}">`;
}

function buildEffectRows(effets, onglet, minRows = 5){
  const rows = effets.filter(e => e.onglet === onglet);
  const html = rows.map(e => `<div class="effect-row">${elementIconFor(e.texte)}<span>${e.texte}</span></div>`);
  while (html.length < minRows) {
    html.push(`<div class="effect-row empty">&nbsp;</div>`);
  }
  return html.join("");
}

function statRow(label, valueHtml){
  return `
    <div class="stat-row">
      <span class="stat-label">${label}</span>
      <span class="stat-value">${valueHtml}</span>
    </div>`;
}

/* ---- icône d'un sort : image distante ou placeholder SVG ---- */
function spellIconHtml(spell){
  if (spell.icone) {
    return `<img class="spell-icon-img" src="${spell.icone}" alt="${spell.nom}" loading="lazy">`;
  }
  return DEFAULT_ICON_SVG;
}

/* ---- icône de classe (image distante, placeholder SVG en secours) ---- */
function classIconHtml(classe){
  const url = CLASS_ICONS[classe];
  return url
    ? `<img class="class-icon-img" src="${url}" alt="${classe}" loading="lazy">`
    : DEFAULT_ICON_SVG;
}

function buildCard(spell){
  const c = spell;

  const leftStats = [
    statRow("Probabilité de coup critique", displayValue(c.cc)),
    statRow("Probabilité d'échec", displayValue(c.ec)),
    statRow("Nb. de lancers par tour", displayValue(c.parTour)),
    statRow("Nb. de lancers par cible", displayValue(c.parCible)),
    statRow("Nb. de tours entre deux lancers", displayValue(c.relance)),
  ].join("");

  const rightStats = [
    statRow("Portée modifiable", checkOrCross(c.porteeModifiable)),
    statRow("Ligne de vue", checkOrCross(c.ligneDeVue)),
    statRow("Lancer en ligne", checkOrCross(c.lancerEnLigne)),
  ].join("");

  return `
  <div class="spell-card" data-spell="${spell.id}">

    <div class="spell-header">
      <div class="spell-header-left">
        <div class="spell-icon">${spellIconHtml(spell)}</div>
        <div class="spell-name-block">
          <div class="spell-name">${spell.nom}</div>
        </div>
      </div>
      <div class="spell-cost">
        <div class="po">${spell.po} PO</div>
        <div class="pa">${spell.pa} PA</div>
      </div>
    </div>

    <div class="section-heading">Effets</div>
    <div class="effect-tabs">
      <div class="effect-tab active" data-onglet="normaux">Normaux</div>
      <div class="effect-tab" data-onglet="critiques">Critiques</div>
    </div>
    <div class="effects-box">
      ${buildEffectRows(spell.effets, "normaux")}
    </div>

    <div class="section-heading">Autres caractéristiques</div>
    <div class="stats-wrap">
      <div class="stats-grid">
        <div class="stats-col left">${leftStats}</div>
        <div class="stats-col right">${rightStats}</div>
      </div>
    </div>

  </div>`;
}

/* ---- tuile d'un sort dans la grille ---- */
function buildSpellTile(spell){
  return `
    <button type="button" class="spell-tile" data-spell="${spell.id}">
      <div class="spell-tile-icon">${spellIconHtml(spell)}</div>
      <span class="spell-tile-name">${spell.nom}</span>
    </button>`;
}

/* ---- page d'accueil : 12 liens de classes + section sorts communs ---- */
function renderHome(){
  const root = document.getElementById("app");

  const commonTiles = COMMON_SPELLS.map(buildSpellTile).join("");

  root.innerHTML = `
    <div class="class-grid">
      ${CLASSES.map(classe => {
        const count = SPELLS.filter(s => s.classe === classe).length;
        return `
        <a class="class-link" href="#/classe/${encodeURIComponent(classe)}">
          <div class="class-link-icon">${classIconHtml(classe)}</div>
          <span class="class-link-name">${classe}</span>
          <span class="class-link-count">${count} sorts</span>
        </a>`;
      }).join("")}
    </div>

    <div class="common-section">
      <button type="button" class="common-toggle" aria-expanded="false">
        <span class="common-chevron">&#9662;</span>
        Sorts communs
      </button>
      <div class="common-body" hidden>
        <div class="class-layout">
          <div class="spell-grid" id="common-spell-grid">
            ${commonTiles}
          </div>
          <aside class="spell-detail" id="common-spell-detail">
            <div class="detail-placeholder">Sélectionne un sort pour voir ses détails.</div>
          </aside>
        </div>
      </div>
    </div>
  `;
}

/* ---- page d'une classe : grille de sorts + panneau de détail ---- */
function renderClass(className){
  const root = document.getElementById("app");
  const spells = SPELLS.filter(s => s.classe === className);

  root.innerHTML = `
    <div class="class-page">
      <a class="back-link" href="#/">&#8592; Toutes les classes</a>
      <h2 class="class-heading">
        <span class="class-heading-icon">${classIconHtml(className)}</span>
        ${className}
        <span class="class-count">(${spells.length} sorts)</span>
      </h2>
      <div class="class-layout">
        <div class="spell-grid">
          ${spells.map(buildSpellTile).join("")}
        </div>
        <aside class="spell-detail" id="spell-detail">
          <div class="detail-placeholder">Sélectionne un sort pour voir ses détails.</div>
        </aside>
      </div>
    </div>
  `;
}

function getRoute(){
  const hash = location.hash.replace(/^#/, "");
  const match = hash.match(/^\/classe\/(.+)$/);
  if (match) {
    const classe = decodeURIComponent(match[1]);
    if (CLASSES.includes(classe)) {
      return { view: "classe", classe };
    }
  }
  return { view: "home" };
}

function render(){
  const route = getRoute();
  if (route.view === "classe") {
    renderClass(route.classe);
  } else {
    renderHome();
  }
}

/* ---- recherche d'un sort par id dans les classes puis dans les communs ---- */
function findSpell(id){
  return SPELLS.find(s => s.id === id) || COMMON_SPELLS.find(s => s.id === id);
}

/* ---- replier / déplier la section "Sorts communs" ---- */
document.addEventListener("click", (event) => {
  const toggle = event.target.closest(".common-toggle");
  if (!toggle) return;

  const body = toggle.parentElement.querySelector(".common-body");
  const expanded = toggle.getAttribute("aria-expanded") === "true";

  toggle.setAttribute("aria-expanded", String(!expanded));
  toggle.classList.toggle("open", !expanded);
  if (body) body.hidden = expanded;
});

/* ---- bascule entre les onglets "Normaux" / "Critiques" (délégation) ---- */
document.addEventListener("click", (event) => {
  const tab = event.target.closest(".effect-tab");
  if (!tab) return;

  const card = tab.closest(".spell-card");
  if (!card) return;

  const onglet = tab.dataset.onglet;
  const spellId = Number(card.dataset.spell);
  const spell = findSpell(spellId);
  if (!spell) return;

  card.querySelectorAll(".effect-tab").forEach(t => {
    t.classList.toggle("active", t === tab);
  });

  const box = card.querySelector(".effects-box");
  if (box) box.innerHTML = buildEffectRows(spell.effets, onglet);
});

/* ---- clic sur une tuile : affiche le panneau de détail à droite ---- */
document.addEventListener("click", (event) => {
  const tile = event.target.closest(".spell-tile");
  if (!tile) return;

  const spellId = Number(tile.dataset.spell);
  const spell = findSpell(spellId);
  if (!spell) return;

  const layout = tile.closest(".class-layout");
  const detail = layout && layout.querySelector(".spell-detail");
  if (detail) detail.innerHTML = buildCard(spell);
});

/* ---- démarrage : attendre les données puis rendre ---- */
window.DATA_READY
  .then(() => {
    window.addEventListener("hashchange", render);
    render();
  })
  .catch((err) => {
    const root = document.getElementById("app");
    root.innerHTML = `<p class="page-title" style="opacity:1">Erreur de chargement des données : ${err.message}</p>`;
    console.error(err);
  });
