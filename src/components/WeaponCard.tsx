import { useState, type KeyboardEvent } from "react";
import type { Weapon } from "../types";
import { WEAPON_TYPES } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useEditingStore, editorKey } from "../lib/editingStore";
import { useModalStore } from "../lib/modalStore";
import { useSessionStore } from "../lib/sessionStore";
import { useHistoryStore } from "../lib/historyStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage, displayValue, fieldLabel } from "../lib/utils";
import { ElementIcon, HistoryIcon } from "./icons";
import { EditableField, InlineEditor } from "./EditableField";
import { HistoryModal } from "./HistoryModal";
import { ResetButton } from "./ResetButton";

const WEAPON_ICON_FILES: Record<(typeof WEAPON_TYPES)[number], string> = {
  Arc: "arc.svg",
  Baguette: "baguette.svg",
  "Bâton": "baton.svg",
  Dagues: "dagues.svg",
  "Épée": "epee.svg",
  Hache: "hache.svg",
  Marteau: "marteau.svg",
  Pelle: "pelle.svg",
};

function weaponIcon(type: Weapon["typeArme"]): string {
  return `assets/img/icons/${WEAPON_ICON_FILES[type] ?? WEAPON_ICON_FILES["Épée"]}`;
}

function WeaponEffects({ weapon }: { weapon: Weapon }) {
  const isAdmin = useSessionStore((state) => state.mode) === "admin";
  const override = useDataStore((state) => state.getOverride("weapon", weapon.classe, "effets"));
  const key = editorKey("weapon", weapon.classe, "effets");
  const editing = useEditingStore((state) => state.activeKey === key);
  const openModal = useModalStore((state) => state.open);

  function openHistory() {
    useHistoryStore.getState().open({ entityType: "weapon", entityKey: weapon.classe, fieldKey: "effets" });
    openModal(`Historique - ${fieldLabel("effets")}`, <HistoryModal />, { wide: true });
  }

  if (editing) {
    return (
      <div className={`editable-field effects-editable ${override ? "is-overridden" : ""}`}>
        <InlineEditor
          entityType="weapon"
          entityKey={weapon.classe}
          fieldKey="effets"
          inputType="textarea"
          onClose={() => useEditingStore.getState().close(key)}
        />
      </div>
    );
  }

  const rows = weapon.effets.map((effect, index) => (
    <div className="effect-row" key={index}>
      <ElementIcon text={effect} />
      <span>{effect}</span>
    </div>
  ));
  const content = rows.length ? rows : <div className="empty-state">Aucun effet.</div>;
  const trigger = isAdmin ? (
    <div
      className="editable-trigger effects-edit-trigger"
      role="button"
      tabIndex={0}
      onClick={() => useEditingStore.getState().open(key)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          useEditingStore.getState().open(key);
        }
      }}
    >
      {content}
    </div>
  ) : <div className="field-value">{content}</div>;

  return (
    <div className={`editable-field effects-editable ${override ? "is-overridden" : ""}`}>
      {trigger}
      {override ? <button type="button" className="field-history effects-history" onClick={openHistory}><HistoryIcon /><span>Historique</span></button> : null}
    </div>
  );
}

function WeaponTypeField({ weapon }: { weapon: Weapon }) {
  const isAdmin = useSessionStore((state) => state.mode) === "admin";
  const override = useDataStore((state) => state.getOverride("weapon", weapon.classe, "typeArme"));
  const key = editorKey("weapon", weapon.classe, "typeArme");
  const editing = useEditingStore((state) => state.activeKey === key);
  const [value, setValue] = useState<Weapon["typeArme"]>(weapon.typeArme);
  const [busy, setBusy] = useState(false);
  const openModal = useModalStore((state) => state.open);

  async function save() {
    setBusy(true);
    try {
      await useDataStore.getState().save("weapon", weapon.classe, "typeArme", value);
      useEditingStore.getState().close(key);
      useToastStore.getState().showToast("Modification enregistrée.", "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  function history() {
    useHistoryStore.getState().open({ entityType: "weapon", entityKey: weapon.classe, fieldKey: "typeArme" });
    openModal(`Historique - ${fieldLabel("typeArme")}`, <HistoryModal />, { wide: true });
  }

  if (editing) {
    return (
      <span className={`editable-field ${override ? "is-overridden" : ""}`}>
        <span className="inline-editor weapon-select-editor">
          <select className="inline-input" value={value} onChange={(event) => setValue(event.target.value as Weapon["typeArme"])} autoFocus>
            {WEAPON_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <span className="editor-actions">
            <button type="button" className="save-edit" disabled={busy} onClick={() => void save()}>Enregistrer</button>
            <button type="button" className="cancel-edit" disabled={busy} onClick={() => useEditingStore.getState().close(key)}>Annuler</button>
          </span>
        </span>
      </span>
    );
  }

  const content = <span className="weapon-type-value"><img src={weaponIcon(weapon.typeArme)} alt="" />{weapon.typeArme}</span>;
  return (
    <span className={`editable-field ${override ? "is-overridden" : ""}`}>
      {isAdmin ? <button type="button" className="editable-trigger" onClick={() => { setValue(weapon.typeArme); useEditingStore.getState().open(key); }}>{content}</button> : <span className="field-value">{content}</span>}
      {override ? <button type="button" className="field-history" aria-label={`Voir l’historique de ${fieldLabel("typeArme")}`} onClick={history}><HistoryIcon /></button> : null}
    </span>
  );
}

function WeaponStat({ weapon, label, fieldKey, value, inputType = "text" }: { weapon: Weapon; label: string; fieldKey: string; value: unknown; inputType?: "text" | "number" }) {
  return <div className="weapon-stat-row"><span className="stat-label">{label}</span><EditableField entityType="weapon" entityKey={weapon.classe} fieldKey={fieldKey} inputType={inputType}>{displayValue(value)}</EditableField></div>;
}

export function WeaponCard({ weapon }: { weapon: Weapon }) {
  return (
    <article className="spell-card weapon-card" data-weapon={weapon.classe}>
      <div className="weapon-header">
        <div className="weapon-icon"><img src={weaponIcon(weapon.typeArme)} alt="" /></div>
        <div className="weapon-name-block"><h3>{weapon.nom}</h3><span>Arme au corps à corps</span></div>
        <ResetButton scope="weapon" resetKey={weapon.classe} />
      </div>
      <div className="weapon-stats-grid">
        <WeaponStat weapon={weapon} label="Coût en PA" fieldKey="pa" value={`${weapon.pa} PA`} inputType="number" />
        <WeaponStat weapon={weapon} label="Coup critique" fieldKey="cc" value={weapon.cc} />
        <WeaponStat weapon={weapon} label="Bonus coups critiques" fieldKey="bonusCc" value={weapon.bonusCc} />
        <div className="weapon-stat-row"><span className="stat-label">Type d’arme</span><WeaponTypeField weapon={weapon} /></div>
      </div>
      <div className="section-heading">Effets</div>
      <div className="effects-box weapon-effects-box"><WeaponEffects weapon={weapon} /></div>
    </article>
  );
}
