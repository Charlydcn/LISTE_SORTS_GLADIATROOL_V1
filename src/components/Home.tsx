import { useState } from "react";
import { useDataStore } from "../lib/dataStore";
import { CLASSES } from "../lib/dataService";
import { ClassIcon } from "./icons";
import { SpellTile } from "./SpellTile";
import { SpellCard } from "./SpellCard";
import { SpellCreator } from "./SpellCreator";
import { useSessionStore } from "../lib/sessionStore";
import { useEditingStore } from "../lib/editingStore";
import { ResetButton } from "./ResetButton";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";

export function Home() {
  const spells = useDataStore((s) => s.spells);
  const commonSpells = useDataStore((s) => s.commonSpells);
  const [commonOpen, setCommonOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const isAdmin = useSessionStore((s) => s.mode) === "admin";

  const selected = selectedId
    ? commonSpells.find((spell) => String(spell.id) === selectedId)
    : null;

  const orderedCommonSpells = [...commonSpells]
    .sort((left, right) => (left.position ?? Number.MAX_SAFE_INTEGER) - (right.position ?? Number.MAX_SAFE_INTEGER));

  async function moveCommonSpell(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const sourceIndex = orderedCommonSpells.findIndex((spell) => String(spell.id) === sourceId);
    const targetIndex = orderedCommonSpells.findIndex((spell) => String(spell.id) === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const reordered = [...orderedCommonSpells];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    try {
      await useDataStore.getState().reorderSpells("Sorts communs", reordered);
      useToastStore.getState().showToast("Ordre des sorts enregistré.", "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    }
  }

  return (
    <>
      <div className="class-grid">
        {CLASSES.map((className) => {
          const count = spells.filter((spell) => spell.classe === className).length;
          return (
            <a
              key={className}
              className="class-link"
              href={`#/classe/${encodeURIComponent(className)}`}
            >
              <div className="class-link-icon">
                <ClassIcon className={className} />
              </div>
              <span className="class-link-name">{className}</span>
              <span className="class-link-count">{count} sorts</span>
            </a>
          );
        })}
      </div>
      <div className="common-section">
        <div className="common-heading">
          <button type="button" className={`common-toggle ${commonOpen ? "open" : ""}`} aria-expanded={commonOpen} onClick={() => setCommonOpen((open) => !open)}><span className="common-chevron">▾</span> Sorts communs</button>
          <div className="heading-actions"><ResetButton scope="class-spells" resetKey="Sorts communs" /></div>
        </div>
        <div className="common-body" hidden={!commonOpen}>
          {isAdmin ? <button type="button" className="new-spell-button" onClick={() => { useEditingStore.getState().close(); setCreating(true); setSelectedId(null); }}>Nouveau sort</button> : null}
          <div className="class-layout">
            <div className="spell-grid">
              {orderedCommonSpells.map((spell) => (
                <SpellTile
                  key={spell.id}
                  spell={spell}
                  selected={String(spell.id) === selectedId}
                  onSelect={() => { useEditingStore.getState().close(); setCreating(false); setSelectedId(String(spell.id)); }}
                  onDropSpell={(sourceId) => void moveCommonSpell(sourceId, String(spell.id))}
                />
              ))}
            </div>
            <aside className="spell-detail" id="common-spell-detail">
              {creating ? <SpellCreator className="Sorts communs" common onCreated={(spell) => { setCreating(false); setSelectedId(String(spell.id)); }} /> : selected ? (
                <SpellCard key={selected.id} spell={selected} />
              ) : (
                <div className="detail-placeholder">Sélectionne un sort pour voir ses détails.</div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
