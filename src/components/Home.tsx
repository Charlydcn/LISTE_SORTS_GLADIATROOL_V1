import { useState } from "react";
import { useDataStore } from "../lib/dataStore";
import { CLASSES } from "../lib/dataService";
import { ClassIcon } from "./icons";
import { SpellTile } from "./SpellTile";
import { SpellCard } from "./SpellCard";
import { SpellCreator } from "./SpellCreator";
import { useSessionStore } from "../lib/sessionStore";

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
        </div>
        <div className="common-body" hidden={!commonOpen}>
          {isAdmin ? <button type="button" className="new-spell-button" onClick={() => { setCreating(true); setSelectedId(null); }}>Nouveau sort</button> : null}
          <div className="class-layout">
            <div className="spell-grid">
              {commonSpells.map((spell) => (
                <SpellTile
                  key={spell.id}
                  spell={spell}
                  selected={String(spell.id) === selectedId}
                  onSelect={() => setSelectedId(String(spell.id))}
                />
              ))}
            </div>
            <aside className="spell-detail" id="common-spell-detail">
              {creating ? <SpellCreator className="Sorts communs" common onCreated={(spell) => { setCreating(false); setSelectedId(String(spell.id)); }} /> : selected ? (
                <SpellCard spell={selected} />
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
