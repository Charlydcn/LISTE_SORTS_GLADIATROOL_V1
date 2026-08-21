import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDataStore } from "../lib/dataStore";
import { CLASSES } from "../lib/dataService";
import { ClassIcon } from "./icons";
import { SpellTile } from "./SpellTile";
import { SpellCard } from "./SpellCard";
import { ClassStatsTable } from "./ClassStatsTable";
import { ResetButton } from "./ResetButton";

export function ClassPage() {
  const params = useParams<{ classe: string }>();
  const className = decodeURIComponent(params.classe || "");
  const spells = useDataStore((s) => s.spells);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!CLASSES.includes(className)) {
    return <Navigate to="/" replace />;
  }

  const classSpells = spells.filter((spell) => spell.classe === className);
  const selected = selectedId
    ? classSpells.find((spell) => String(spell.id) === selectedId)
    : null;

  return (
    <div className="class-page">
      <a className="back-link" href="#/">
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
        <ResetButton scope="class-spells" resetKey={className} />
      </div>
      <div className="class-layout">
        <div className="spell-grid">
          {classSpells.map((spell) => (
            <SpellTile
              key={spell.id}
              spell={spell}
              selected={String(spell.id) === selectedId}
              onSelect={() => setSelectedId(String(spell.id))}
            />
          ))}
        </div>
        <aside className="spell-detail" id="spell-detail">
          {selected ? (
            <SpellCard spell={selected} />
          ) : (
            <div className="detail-placeholder">Sélectionne un sort pour voir ses détails.</div>
          )}
        </aside>
      </div>
      <ClassStatsTable className={className} />
    </div>
  );
}
