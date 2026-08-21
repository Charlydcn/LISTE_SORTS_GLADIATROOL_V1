import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { SpellIcon } from "./icons";

interface SpellTileProps {
  spell: Spell;
  selected: boolean;
  onSelect: () => void;
}

export function SpellTile({ spell, selected, onSelect }: SpellTileProps) {
  const overrides = useDataStore((s) => s.overrides);
  const hasActiveOverride = Object.values(overrides).some(
    (row) => row.entity_type === "spell" && String(row.entity_key) === String(spell.id),
  );

  return (
    <button
      type="button"
      className={`spell-tile ${selected ? "selected" : ""} ${hasActiveOverride ? "is-overridden" : ""}`}
      onClick={onSelect}
    >
      <div className="spell-tile-icon">
        <SpellIcon spell={spell} />
      </div>
      <span className="spell-tile-name">{spell.nom}</span>
    </button>
  );
}
