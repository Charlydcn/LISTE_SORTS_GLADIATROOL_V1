import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { errorMessage } from "../lib/utils";
import { uploadSpellImage } from "../lib/spellImageService";
import { useToastStore } from "../lib/toastStore";

type Props = { className: string; common?: boolean; onCreated: (spell: Spell) => void };

const defaults = { nom: "Nouveau sort", description: "", pa: 3, po: "1 à 6", cc: "1/50", ec: "-", relance: "-", parTour: "", parCible: "", porteeModifiable: true, ligneDeVue: true, lancerEnLigne: false, effetsNormaux: "", effetsCritiques: "" };

function lines(value: string) { return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean); }

export function SpellCreator({ className, common = false, onCreated }: Props) {
  const [mode, setMode] = useState<"choice" | "new" | "existing">("choice");
  const [values, setValues] = useState(defaults);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const spells = useDataStore((s) => common ? s.commonSpells : s.spells.filter((spell) => spell.classe === className));
  const baseline = useDataStore((s) => s.getBaselineSpells());
  const missing = baseline.filter((spell) => spell.classe === className && !spells.some((item) => item.id === spell.id));

  function set<K extends keyof typeof defaults>(key: K, value: (typeof defaults)[K]) { setValues((current) => ({ ...current, [key]: value })); }

  async function create(event: FormEvent) {
    event.preventDefault();
    const normal = lines(values.effetsNormaux);
    if (!normal.length) { setError("Ajoutez au moins un effet normal."); return; }
    setBusy(true); setError("");
    try {
      const spell = await useDataStore.getState().createSpell(className, {
        nom: values.nom.trim(), description: values.description.trim(), pa: values.pa, po: values.po.trim(), cc: values.cc.trim(), ec: values.ec.trim(), relance: values.relance.trim(),
        parTour: values.parTour === "" ? null : Number(values.parTour), parCible: values.parCible === "" ? null : Number(values.parCible),
        porteeModifiable: values.porteeModifiable, ligneDeVue: values.ligneDeVue, lancerEnLigne: values.lancerEnLigne,
        icone: null, commun: common, effets: [...normal.map((texte) => ({ onglet: "normaux" as const, texte })), ...lines(values.effetsCritiques).map((texte) => ({ onglet: "critiques" as const, texte }))],
      });
      if (file) {
        const uploaded = await uploadSpellImage(spell.id, file);
        await useDataStore.getState().save("spell", String(spell.id), "icone", uploaded.url);
      }
      useToastStore.getState().showToast("Sort créé.", "success"); onCreated(useDataStore.getState().getSpellById(spell.id) ?? spell);
    } catch (reason) { setError(errorMessage(reason)); } finally { setBusy(false); }
  }

  async function restore(spell: Spell) {
    setBusy(true); setError("");
    try { await useDataStore.getState().restoreNativeSpell(spell); useToastStore.getState().showToast("Sort natif rétabli.", "success"); onCreated(spell); }
    catch (reason) { setError(errorMessage(reason)); } finally { setBusy(false); }
  }

  if (mode === "choice") return <div className="detail-placeholder creator-choice"><p>Ajouter un sort</p><button className="primary-button" onClick={() => setMode("new")}>Nouveau sort</button><button className="secondary-button" onClick={() => setMode("existing")}>Sort existant</button></div>;
  if (mode === "existing") return <div className="spell-card spell-creator"><div className="spell-creator-title">Rétablir un sort natif</div>{missing.length ? <div className="restore-list">{missing.map((spell) => <button key={spell.id} type="button" disabled={busy} onClick={() => void restore(spell)}>{spell.nom}</button>)}</div> : <p className="empty-state">Aucun sort natif à rétablir.</p>}<button className="cancel-edit" type="button" onClick={() => setMode("choice")}>Retour</button>{error ? <p className="save-error">{error}</p> : null}</div>;

  return <form className="spell-card spell-creator" onSubmit={create}>
    <div className="spell-creator-title">Nouveau sort</div>
    <label>Nom<input value={values.nom} onChange={(e) => set("nom", e.target.value)} required /></label>
    <label>Description<textarea rows={3} value={values.description} onChange={(e) => set("description", e.target.value)} /></label>
    <div className="creator-grid"><label>PA<input type="number" value={values.pa} onChange={(e) => set("pa", Number(e.target.value))} required /></label><label>PO<input value={values.po} onChange={(e) => set("po", e.target.value)} required /></label><label>Coup critique<input value={values.cc} onChange={(e) => set("cc", e.target.value)} required /></label><label>Échec critique<input value={values.ec} onChange={(e) => set("ec", e.target.value)} required /></label><label>Relance (tours)<input value={values.relance} onChange={(e) => set("relance", e.target.value)} required /></label><label>Lancers/tour<input type="number" value={values.parTour} onChange={(e) => set("parTour", e.target.value)} /></label><label>Lancers/cible<input type="number" value={values.parCible} onChange={(e) => set("parCible", e.target.value)} /></label></div>
    <div className="creator-checks">{([ ["porteeModifiable", "Portée modifiable"], ["ligneDeVue", "Ligne de vue"], ["lancerEnLigne", "Lancer en ligne"] ] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={values[key]} onChange={(e) => set(key, e.target.checked)} /> {label}</label>)}</div>
    <label>Effets normaux<textarea rows={5} value={values.effetsNormaux} onChange={(e) => set("effetsNormaux", e.target.value)} required /></label><label>Effets critiques<textarea rows={4} value={values.effetsCritiques} onChange={(e) => set("effetsCritiques", e.target.value)} /></label>
    <div className="creator-image"><input ref={fileRef} type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)} /><span>{file?.name ?? "Icône facultative"}</span></div>
    <div className="editor-actions"><button className="primary-button" disabled={busy} type="submit">Créer le sort</button><button className="cancel-edit" disabled={busy} type="button" onClick={() => setMode("choice")}>Annuler</button></div>{error ? <p className="save-error">{error}</p> : null}
  </form>;
}
