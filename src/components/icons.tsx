import type { ReactNode } from "react";
import type { Spell } from "../types";
import { CLASS_ICONS } from "../lib/dataService";

export function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" />
    </svg>
  );
}

export function HistoryIcon() {
  return (
    <svg className="history-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5"></circle>
      <path d="M12 7.5V12l3.2 2"></path>
    </svg>
  );
}

export function SpellIcon({ spell }: { spell: Spell }) {
  if (spell.icone) {
    return <img className="spell-icon-img" src={spell.icone} alt={spell.nom} loading="lazy" />;
  }
  return <DefaultIcon />;
}

export function ClassIcon({ className }: { className: string }) {
  const url = CLASS_ICONS[className];
  if (url) {
    return <img className="class-icon-img" src={url} alt={className} loading="lazy" />;
  }
  return <DefaultIcon />;
}

const ELEMENT_FILES: Record<string, string> = {
  Eau: "WaterDamage.svg",
  Terre: "EarthDamage.svg",
  Air: "AirDamage.svg",
  Feu: "FireDamage.svg",
  Neutre: "NeutralDamage.svg",
};

export function ElementIcon({ text }: { text: string }) {
  if (!/(Dommages|Dommage|Vole)/.test(text)) return null;
  const match = text.match(/\((Eau|Terre|Air|Feu|Neutre)\)/);
  if (!match) return null;
  return <img className="element" src={`assets/img/icons/${ELEMENT_FILES[match[1]]}`} alt={match[1]} />;
}

export function CheckOrCross({ value }: { value: unknown }) {
  return value ? (
    <span className="stat-icon yes" aria-label="Oui">
      ✓
    </span>
  ) : (
    <span className="stat-icon no" aria-label="Non">
      ✗
    </span>
  );
}

export function FragmentBr({ text }: { text: string }): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, index) => (
    <span key={index}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}
