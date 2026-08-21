import { useState } from "react";
import type { Effect, EffectTab, Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useSessionStore } from "../lib/sessionStore";
import { useModalStore } from "../lib/modalStore";
import { useHistoryStore } from "../lib/historyStore";
import { displayValue, fieldLabel } from "../lib/utils";
import { CheckOrCross, ElementIcon, HistoryIcon, SpellIcon } from "./icons";
import { EditableField, InlineEditor } from "./EditableField";
import { ResetButton } from "./ResetButton";
import { CommentsSection } from "./CommentsSection";
import { HistoryModal } from "./HistoryModal";
import { SpellImageEditor } from "./SpellImageEditor";
import { editorKey, useEditingStore } from "../lib/editingStore";

function EffectRows({ effects, tab }: { effects: Effect[]; tab: EffectTab }) {
  const rows = effects.filter((effect) => effect.onglet === tab);
  const items = rows.map((effect, index) => (
    <div className="effect-row" key={index}>
      <ElementIcon text={effect.texte} />
      <span>{effect.texte}</span>
    </div>
  ));
  while (items.length < 5) {
    items.push(
      <div className="effect-row empty" aria-hidden="true" key={`empty-${items.length}`}>
        &nbsp;
      </div>,
    );
  }
  return <>{items}</>;
}

function EditableEffects({ spell, tab }: { spell: Spell; tab: EffectTab }) {
  const fieldKey = `effets.${tab}`;
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const override = useDataStore((s) => s.getOverride("spell", String(spell.id), fieldKey));
  const openModal = useModalStore((s) => s.open);
  const key = editorKey("spell", spell.id, fieldKey);
  const editing = useEditingStore((s) => s.activeKey === key);

  function openHistory() {
    useHistoryStore.getState().open({ entityType: "spell", entityKey: String(spell.id), fieldKey });
    openModal(`Historique - ${fieldLabel(fieldKey)}`, <HistoryModal />, { wide: true });
  }

  if (editing) {
    return (
      <div className={`editable-field effects-editable ${override ? "is-overridden" : ""}`}>
        <InlineEditor
          entityType="spell"
          entityKey={spell.id}
          fieldKey={fieldKey}
          inputType="textarea"
          onClose={() => useEditingStore.getState().close(key)}
        />
      </div>
    );
  }

  const rows = <EffectRows effects={spell.effets} tab={tab} />;
  const trigger = isAdmin ? (
    <div
      className="editable-trigger effects-edit-trigger"
      role="button"
      tabIndex={0}
      onClick={() => useEditingStore.getState().open(key)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          useEditingStore.getState().open(key);
        }
      }}
    >
      {rows}
    </div>
  ) : (
    <div className="field-value">{rows}</div>
  );
  const history = override ? (
    <button type="button" className="field-history effects-history" onClick={openHistory}>
      <HistoryIcon /> <span>Historique</span>
    </button>
  ) : null;

  return (
    <div className={`editable-field effects-editable ${override ? "is-overridden" : ""}`}>
      {trigger}
      {history}
    </div>
  );
}

function StatRow({
  label,
  entityKey,
  fieldKey,
  value,
  inputType = "text",
}: {
  label: string;
  entityKey: number;
  fieldKey: string;
  value: unknown;
  inputType?: "text" | "number" | "nullable-number" | "boolean";
}) {
  const content = inputType === "boolean" ? <CheckOrCross value={value} /> : displayValue(value);
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <EditableField
        entityType="spell"
        entityKey={entityKey}
        fieldKey={fieldKey}
        inputType={inputType}
      >
        {content}
      </EditableField>
    </div>
  );
}

export function SpellCard({ spell }: { spell: Spell }) {
  const [tab, setTab] = useState<EffectTab>("normaux");
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const overrides = useDataStore((s) => s.overrides);
  const overrideCount = Object.values(overrides).filter(
    (row) => row.entity_type === "spell" && String(row.entity_key) === String(spell.id),
  ).length;

  return (
    <div className="spell-card" data-spell={spell.id}>
      <div className="spell-header">
        <div className="spell-header-left">
          <div className="spell-icon">
            {isAdmin ? <SpellImageEditor spell={spell} /> : <SpellIcon spell={spell} />}
          </div>
          <div className="spell-name-block">
            <EditableField
              entityType="spell"
              entityKey={spell.id}
              fieldKey="nom"
              inputType="text"
              extraClass="spell-name"
            >
              {spell.nom}
            </EditableField>
          </div>
        </div>
        <div className="spell-cost">
          <div className="po">
            <EditableField entityType="spell" entityKey={spell.id} fieldKey="po" inputType="text">
              {`${spell.po} PO`}
            </EditableField>
          </div>
          <div className="pa">
            <EditableField entityType="spell" entityKey={spell.id} fieldKey="pa" inputType="number">
              {`${spell.pa} PA`}
            </EditableField>
          </div>
        </div>
      </div>
      <div className="spell-card-actions">
        <ResetButton scope="spell" resetKey={spell.id} />
      </div>
      <div className="section-heading">Effets</div>
      <div className="effect-tabs" role="tablist" aria-label="Type d'effets">
        <button
          type="button"
          className={`effect-tab ${tab === "normaux" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "normaux"}
          onClick={() => { useEditingStore.getState().close(); setTab("normaux"); }}
        >
          Normaux
        </button>
        <button
          type="button"
          className={`effect-tab ${tab === "critiques" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "critiques"}
          onClick={() => { useEditingStore.getState().close(); setTab("critiques"); }}
        >
          Critiques
        </button>
      </div>
      <div className="effects-box">
        <EditableEffects spell={spell} tab={tab} />
      </div>
      <div className="section-heading">Autres caractéristiques</div>
      <div className="stats-wrap">
        <div className="stats-grid">
          <div className="stats-col left">
            <StatRow
              label="Probabilité de coup critique"
              entityKey={spell.id}
              fieldKey="cc"
              value={spell.cc}
            />
            <StatRow
              label="Probabilité d'échec"
              entityKey={spell.id}
              fieldKey="ec"
              value={spell.ec}
            />
            <StatRow
              label="Nb. de lancers par tour"
              entityKey={spell.id}
              fieldKey="parTour"
              value={spell.parTour}
              inputType="nullable-number"
            />
            <StatRow
              label="Nb. de lancers par cible"
              entityKey={spell.id}
              fieldKey="parCible"
              value={spell.parCible}
              inputType="nullable-number"
            />
            <StatRow
              label="Nb. de tours entre deux lancers"
              entityKey={spell.id}
              fieldKey="relance"
              value={spell.relance}
            />
          </div>
          <div className="stats-col right">
            <StatRow
              label="Portée modifiable"
              entityKey={spell.id}
              fieldKey="porteeModifiable"
              value={spell.porteeModifiable}
              inputType="boolean"
            />
            <StatRow
              label="Ligne de vue"
              entityKey={spell.id}
              fieldKey="ligneDeVue"
              value={spell.ligneDeVue}
              inputType="boolean"
            />
            <StatRow
              label="Lancer en ligne"
              entityKey={spell.id}
              fieldKey="lancerEnLigne"
              value={spell.lancerEnLigne}
              inputType="boolean"
            />
          </div>
        </div>
      </div>
      {isAdmin ? <CommentsSection spellId={spell.id} /> : null}
    </div>
  );
}
