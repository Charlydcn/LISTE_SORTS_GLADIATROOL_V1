import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDataStore } from "../lib/dataStore";
import { CLASSES } from "../lib/dataService";
import { ClassIcon } from "./icons";
import { SortableSpellGrid } from "./SortableSpellGrid";
import { SpellCard } from "./SpellCard";
import { ClassStatsTable } from "./ClassStatsTable";
import { ResetButton } from "./ResetButton";
import { SpellCreator } from "./SpellCreator";
import { useSessionStore } from "../lib/sessionStore";
import { useEditingStore } from "../lib/editingStore";
import { ExportClassButton } from "./SpellTransferActions";

export function ClassPage() {
  const params = useParams<{ classe: string }>();
  const className = decodeURIComponent(params.classe || "");
  const spells = useDataStore((s) => s.spells);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const isAdmin = useSessionStore((s) => s.mode) === "admin";

  if (!CLASSES.includes(className)) {
    return <Navigate to="/sorts" replace />;
  }

  const classSpells = spells
    .filter((spell) => spell.classe === className)
    .sort((left, right) => (left.position ?? Number.MAX_SAFE_INTEGER) - (right.position ?? Number.MAX_SAFE_INTEGER));
  const selected = selectedId
    ? classSpells.find((spell) => String(spell.id) === selectedId)
    : null;

  return (
    <div className="class-page">
      <a className="back-link" href="#/sorts">
        ← Toutes les classes
      </a>
      <h2 className="class-heading">
        <span className="class-heading-icon">
          <ClassIcon className={className} />
        </span>
        {className}
        <span className="class-count">({classSpells.length} sorts)</span>
      </h2>
      <div className="panel-heading-row spells-panel-heading">
        <h3>Sorts</h3>
        <div className="heading-actions">
          {isAdmin ? <ExportClassButton className={className} /> : null}
          <ResetButton scope="class-spells" resetKey={className} />
        </div>
      </div>
      {isAdmin ? <button type="button" className="new-spell-button" onClick={() => { useEditingStore.getState().close(); setCreating(true); setSelectedId(null); }}>Nouveau sort</button> : null}
      <div className="class-layout">
        <SortableSpellGrid className={className} spells={classSpells} selectedId={selectedId} onSelect={(spell) => { useEditingStore.getState().close(); setCreating(false); setSelectedId(String(spell.id)); }} />
        <aside className="spell-detail" id="spell-detail">
          {creating ? <SpellCreator className={className} onCreated={(spell) => { setCreating(false); setSelectedId(String(spell.id)); }} /> : selected ? (
            <SpellCard key={selected.id} spell={selected} />
          ) : (
            <div className="detail-placeholder">Sélectionne un sort pour voir ses détails.</div>
          )}
        </aside>
      </div>
      <ClassStatsTable className={className} />
    </div>
  );
}
