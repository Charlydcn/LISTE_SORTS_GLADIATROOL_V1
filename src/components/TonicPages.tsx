import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useParams } from "react-router-dom";
import type { Spell, Tonic, TonicCategory } from "../types";
import { CLASSES } from "../lib/dataService";
import { useDataStore } from "../lib/dataStore";
import { editorKey, useEditingStore } from "../lib/editingStore";
import { useHistoryStore } from "../lib/historyStore";
import { useModalStore } from "../lib/modalStore";
import { useSessionStore } from "../lib/sessionStore";
import { useTonicStore } from "../lib/tonicStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage, fieldLabel } from "../lib/utils";
import { CommentsSection } from "./CommentsSection";
import { HistoryModal } from "./HistoryModal";
import { ClassIcon, HistoryIcon, SpellIcon, TonicEffectIcon } from "./icons";

function TonicField({ tonic, field, multiline = false }: { tonic: Tonic; field: "title" | "effects"; multiline?: boolean }) {
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const override = useTonicStore((s) => s.getOverride(tonic.id, field));
  const key = editorKey("tonic", tonic.id, field);
  const editing = useEditingStore((s) => s.activeKey === key);
  const [value, setValue] = useState(() => field === "effects" ? tonic.effects.join("\n") : tonic.title);
  const [busy, setBusy] = useState(false);

  async function save() {
    const parsed = field === "effects" ? value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : value.trim();
    if (field === "title" && !parsed) return;
    setBusy(true);
    try {
      await useTonicStore.getState().save(tonic.id, field, parsed);
      useEditingStore.getState().close(key);
      useToastStore.getState().showToast("Modification enregistrée.", "success");
    } catch (error) { useToastStore.getState().showToast(errorMessage(error), "error"); }
    finally { setBusy(false); }
  }

  function history() {
    useHistoryStore.getState().open({ entityType: "tonic", entityKey: String(tonic.id), fieldKey: field });
    useModalStore.getState().open(`Historique - ${fieldLabel(field)}`, <HistoryModal />, { wide: true });
  }

  if (editing) return (
    <div className={`tonic-edit ${override ? "is-overridden" : ""}`}>
      {multiline
        ? <textarea rows={7} value={value} onChange={(event) => setValue(event.target.value)} autoFocus />
        : <input value={value} onChange={(event) => setValue(event.target.value)} autoFocus />}
      <div className="editor-actions"><button className="save-edit" type="button" disabled={busy} onClick={() => void save()}>Enregistrer</button><button className="cancel-edit" type="button" onClick={() => useEditingStore.getState().close(key)}>Annuler</button></div>
    </div>
  );

  const content = field === "effects"
    ? (tonic.effects.length ? tonic.effects.map((effect, index) => <div className="effect-row" key={index}><TonicEffectIcon text={effect} /><span>{effect}</span></div>) : <div className="empty-state">Aucun effet.</div>)
    : tonic.title;
  return <div className={`tonic-field ${override ? "is-overridden" : ""}`}>{isAdmin ? <button className="editable-trigger" type="button" onClick={() => { setValue(field === "effects" ? tonic.effects.join("\n") : tonic.title); useEditingStore.getState().open(key); }}>{content}</button> : content}{override ? <button className="field-history" type="button" aria-label="Voir l’historique" onClick={history}><HistoryIcon /></button> : null}</div>;
}

function SpellReference({ spell, linked = false }: { spell: Spell | undefined; linked?: boolean }) {
  if (!spell) return <div className="empty-state">Sort source introuvable dans la liste actuelle.</div>;
  const normal = spell.effets.filter((effect) => effect.onglet === "normaux");
  const critical = spell.effets.filter((effect) => effect.onglet === "critiques");
  const title = linked ? <a href={`#/sorts/classe/${encodeURIComponent(spell.classe)}/sort/${spell.id}`}>{spell.nom}</a> : <strong>{spell.nom}</strong>;
  return <div className="source-spell"><div className="source-spell-head"><SpellIcon spell={spell} /><div>{title}<span>Sort #{spell.id}</span></div></div><div className="source-effects"><div><strong>Effets normaux</strong>{normal.map((effect, index) => <p key={index}>{effect.texte}</p>)}</div><div><strong>Effets critiques</strong>{critical.length ? critical.map((effect, index) => <p key={index}>{effect.texte}</p>) : <p>Aucun.</p>}</div></div></div>;
}

function SpellPicker({ className, selected, onSelect }: { className: string; selected: number | null; onSelect: (spell: Spell) => void }) {
  const spells = useDataStore((s) => s.spells.filter((spell) => spell.classe === className));
  return <div className="spell-picker">{spells.map((spell) => <button key={spell.id} type="button" className={spell.id === selected ? "selected" : ""} onClick={() => onSelect(spell)}><SpellIcon spell={spell} /><span>{spell.nom}</span></button>)}</div>;
}

function TonicCard({ tonic, onDeleted }: { tonic: Tonic; onDeleted: () => void }) {
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const [confirming, setConfirming] = useState(false);
  const [choosingSpell, setChoosingSpell] = useState(false);
  const [busy, setBusy] = useState(false);
  const spell = useDataStore((s) => tonic.spellId === null ? undefined : s.spells.find((item) => item.id === tonic.spellId && item.classe === tonic.className));
  const overrideCount = useTonicStore((s) => Object.values(s.overrides).filter((row) => row.entity_key === String(tonic.id)).length);

  async function reset() {
    setBusy(true); try { await useTonicStore.getState().reset(tonic); useToastStore.getState().showToast("Élément réinitialisé.", "success"); } catch (error) { useToastStore.getState().showToast(errorMessage(error), "error"); } finally { setBusy(false); }
  }
  async function remove() {
    if (!confirming) { setConfirming(true); window.setTimeout(() => setConfirming(false), 4000); return; }
    setBusy(true); try { await useTonicStore.getState().deleteTonic(tonic); onDeleted(); useToastStore.getState().showToast("Élément supprimé.", "success"); } catch (error) { useToastStore.getState().showToast(errorMessage(error), "error"); } finally { setBusy(false); setConfirming(false); }
  }

  return <article className="spell-card tonic-card"><div className="tonic-card-title"><TonicField tonic={tonic} field="title" /><span>#{tonic.id}</span></div><div className="spell-card-actions">{isAdmin ? <><button className="reset-button" type="button" disabled={!overrideCount || busy} onClick={() => void reset()}>Réinitialiser</button><button className={`danger-button ${confirming ? "confirming" : ""}`} type="button" disabled={busy} onClick={() => void remove()}>{confirming ? "Vraiment ?" : "Supprimer"}</button></> : null}</div>{tonic.kind === "mutation" ? <><div className="section-heading">Sort associé</div><SpellReference spell={spell} linked />{isAdmin ? <><button className="secondary-button change-source" type="button" onClick={() => setChoosingSpell((open) => !open)}>Changer le sort associé</button>{choosingSpell && tonic.className ? <SpellPicker className={tonic.className} selected={tonic.spellId} onSelect={(selectedSpell) => { void useTonicStore.getState().save(tonic.id, "spellId", selectedSpell.id).then(() => { setChoosingSpell(false); useToastStore.getState().showToast("Sort associé modifié.", "success"); }).catch((error) => useToastStore.getState().showToast(errorMessage(error), "error")); }} /> : null}</> : null}</> : null}<div className="section-heading">Effets</div><div className="effects-box"><TonicField tonic={tonic} field="effects" multiline /></div>{isAdmin ? <CommentsSection tonicId={tonic.id} /> : null}</article>;
}

function TonicCreator({ kind, className, onCreated, onCancel }: { kind: "tonique" | "mutation"; className?: string; onCreated: (tonic: Tonic) => void; onCancel: () => void }) {
  const existingMutations = useTonicStore((s) => s.tonics.filter((tonic) => tonic.kind === "mutation" && tonic.className === className));
  const [title, setTitle] = useState(kind === "mutation" ? "Ton. Mutatio" : ""); const [effects, setEffects] = useState(""); const [category, setCategory] = useState<TonicCategory>(kind === "mutation" ? "mutation" : "palier1"); const [spell, setSpell] = useState<Spell | null>(null); const [busy, setBusy] = useState(false);
  function selectSpell(selectedSpell: Spell) { const duplicateNumber = existingMutations.filter((mutation) => mutation.spellId === selectedSpell.id).length + 1; setSpell(selectedSpell); setTitle(`Ton. Mutation '${selectedSpell.nom}'${duplicateNumber > 1 ? ` ${duplicateNumber}` : ""}`); }
  async function submit(event: FormEvent) { event.preventDefault(); if (kind === "mutation" && !spell) return; setBusy(true); try { const tonic = await useTonicStore.getState().createTonic({ kind, category, className: kind === "mutation" ? className! : null, title: title.trim(), effects: effects.split(/\r?\n/).map((line) => line.trim()).filter(Boolean), spellId: spell?.id ?? null }); onCreated(tonic); useToastStore.getState().showToast(`${kind === "mutation" ? "Mutation" : "Tonique"} créé.`, "success"); } catch (error) { useToastStore.getState().showToast(errorMessage(error), "error"); } finally { setBusy(false); } }
  return <form className="spell-card tonic-creator" onSubmit={submit}><h2>{kind === "mutation" ? "Nouvelle mutation" : "Nouveau tonique"}</h2><label>Titre<input required readOnly={kind === "mutation"} value={title} onChange={(event) => setTitle(event.target.value)} /></label>{kind === "tonique" ? <label>Catégorie<select value={category} onChange={(event) => setCategory(event.target.value as TonicCategory)}><option value="palier1">Palier 1</option><option value="palier2">Palier 2</option><option value="rarus">Rarus</option></select></label> : <><label>Sort associé</label><SpellPicker className={className!} selected={spell?.id ?? null} onSelect={selectSpell} />{spell ? <SpellReference spell={spell} /> : <p className="empty-state">Choisis un sort pour afficher ses effets actuels.</p>}</>}<label>Effets<textarea rows={7} value={effects} onChange={(event) => setEffects(event.target.value)} placeholder="Un effet par ligne" /></label><div className="editor-actions"><button className="primary-button" type="submit" disabled={busy || (kind === "mutation" && !spell)}>Créer</button><button className="secondary-button" type="button" onClick={onCancel}>Annuler</button></div></form>;
}

function DeletedNativeList({ kind, className, onRestore }: { kind: "tonique" | "mutation"; className?: string; onRestore: (tonic: Tonic) => void }) {
  const base = useTonicStore((s) => s.baseTonics); const deleted = useTonicStore((s) => s.deletedNativeTonics); const deletedIds = new Set(deleted.map((row) => row.tonic_id)); const missing = base.filter((tonic) => tonic.kind === kind && (!className || tonic.className === className) && deletedIds.has(tonic.id));
  if (!missing.length) return null;
  return <div className="restore-panel"><strong>Éléments natifs supprimés</strong>{missing.map((tonic) => <button type="button" key={tonic.id} onClick={() => void useTonicStore.getState().restoreNative(tonic).then(() => onRestore(tonic)).catch((error) => useToastStore.getState().showToast(errorMessage(error), "error"))}>Recréer {tonic.title}</button>)}</div>;
}

const GROUPS: Array<{ category: TonicCategory; label: string }> = [{ category: "palier1", label: "Palier 1" }, { category: "palier2", label: "Palier 2" }, { category: "rarus", label: "Rarus" }];

export function TonicsPage() {
  const tonics = useTonicStore((s) => s.tonics.filter((tonic) => tonic.kind === "tonique")); const isAdmin = useSessionStore((s) => s.mode) === "admin"; const [selected, setSelected] = useState<number | null>(tonics[0]?.id ?? null); const [creating, setCreating] = useState(false); const tonic = tonics.find((item) => item.id === selected);
  useEffect(() => { if (!creating && selected === null && tonics.length) setSelected(tonics[0].id); }, [creating, selected, tonics]);
  return <><div className="page-heading"><div><h1>Toniques</h1><p>25 toniques répartis par palier.</p></div>{isAdmin ? <button className="new-spell-button" type="button" onClick={() => { setCreating(true); setSelected(null); }}>Nouveau tonique</button> : null}</div><div className="catalog-layout"><div className="tonic-groups">{GROUPS.map((group) => <section key={group.category}><h2>{group.label}</h2><div className="tonic-list">{tonics.filter((item) => item.category === group.category).map((item) => <button className={selected === item.id ? "selected" : ""} type="button" key={item.id} onClick={() => { setCreating(false); setSelected(item.id); }}>{item.title}</button>)}</div></section>)}{isAdmin ? <DeletedNativeList kind="tonique" onRestore={(item) => setSelected(item.id)} /> : null}</div><aside>{creating ? <TonicCreator kind="tonique" onCreated={(item) => { setCreating(false); setSelected(item.id); }} onCancel={() => setCreating(false)} /> : tonic ? <TonicCard tonic={tonic} onDeleted={() => setSelected(null)} /> : <div className="detail-placeholder">Sélectionne un tonique.</div>}</aside></div></>;
}

export function MutationsPage() {
  const mutations = useTonicStore((s) => s.tonics.filter((tonic) => tonic.kind === "mutation"));
  return <><div className="page-heading"><div><h1>Mutations</h1><p>Mutations disponibles par classe.</p></div></div><div className="class-grid">{CLASSES.map((className) => <a key={className} className="class-link" href={`#/mutations/${encodeURIComponent(className)}`}><div className="class-link-icon"><ClassIcon className={className} /></div><span className="class-link-name">{className}</span><span className="class-link-count">{mutations.filter((item) => item.className === className).length} mutations</span></a>)}</div></>;
}

export function MutationClassPage() {
  const { classe } = useParams(); const className = decodeURIComponent(classe ?? ""); const mutations = useTonicStore((s) => s.tonics.filter((tonic) => tonic.kind === "mutation" && tonic.className === className)); const spells = useDataStore((s) => s.spells.filter((spell) => spell.classe === className)); const isAdmin = useSessionStore((s) => s.mode) === "admin"; const [selected, setSelected] = useState<number | null>(mutations[0]?.id ?? null); const [creating, setCreating] = useState(false); const mutation = mutations.find((item) => item.id === selected);
  useEffect(() => { if (!creating && selected === null && mutations.length) setSelected(mutations[0].id); }, [creating, selected, mutations]);
  if (!CLASSES.includes(className)) return <Navigate to="/mutations" replace />;
  return <><div className="page-heading"><div><a className="back-link" href="#/mutations">← Toutes les classes</a><h1>{className} — Mutations</h1><p>{mutations.length} mutations actuelles.</p></div>{isAdmin ? <button className="new-spell-button" type="button" onClick={() => { setCreating(true); setSelected(null); }}>Nouvelle mutation</button> : null}</div><div className="catalog-layout"><div><div className="mutation-list">{mutations.map((item) => { const sourceSpell = spells.find((spell) => spell.id === item.spellId); return <button className={selected === item.id ? "selected" : ""} type="button" key={item.id} onClick={() => { setCreating(false); setSelected(item.id); }}><span className="mutation-list-main">{sourceSpell ? <span className="mutation-list-icon"><SpellIcon spell={sourceSpell} /></span> : null}<span>{item.title}</span></span><small>Sort #{item.spellId ?? "—"}</small></button>; })}</div>{isAdmin ? <DeletedNativeList kind="mutation" className={className} onRestore={(item) => setSelected(item.id)} /> : null}</div><aside>{creating ? <TonicCreator kind="mutation" className={className} onCreated={(item) => { setCreating(false); setSelected(item.id); }} onCancel={() => setCreating(false)} /> : mutation ? <TonicCard tonic={mutation} onDeleted={() => setSelected(null)} /> : <div className="detail-placeholder">Sélectionne une mutation.</div>}</aside></div></>;
}
