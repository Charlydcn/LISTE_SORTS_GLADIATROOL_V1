import { useEffect, useState, type ReactNode } from "react";
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
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [spell.icone]);
  if (spell.icone && !failed) {
    return (
      <img
        className="spell-icon-img"
        src={spell.icone}
        alt={spell.nom}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
      />
    );
  }
  return <DefaultIcon />;
}

export function TrashIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>; }

export function DragHandleIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><circle cx="8" cy="5" r="1.5" /><circle cx="16" cy="5" r="1.5" /><circle cx="8" cy="12" r="1.5" /><circle cx="16" cy="12" r="1.5" /><circle cx="8" cy="19" r="1.5" /><circle cx="16" cy="19" r="1.5" /></svg>; }

export function LoginIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v14h-5M5 12h10m-3-3 3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

export function LogoutIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5m9-7H9m3-3-3 3 3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

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

const TONIC_STAT_ICONS: Array<{ pattern: RegExp; file: string; label: string }> = [
  { pattern: /\bPA\b/i, file: "PA.svg", label: "PA" },
  { pattern: /\bPM\b/i, file: "PM.svg", label: "PM" },
  { pattern: /Vitalité/i, file: "Vita.svg", label: "Vitalité" },
  { pattern: /\bPV\b/i, file: "PV.svg", label: "PV" },
  { pattern: /Sagesse/i, file: "Wisdom.svg", label: "Sagesse" },
  { pattern: /Initiative/i, file: "Ini.svg", label: "Initiative" },
  { pattern: /Terre/i, file: "EarthDamage.svg", label: "Terre" },
  { pattern: /Eau/i, file: "WaterDamage.svg", label: "Eau" },
  { pattern: /Feu/i, file: "FireDamage.svg", label: "Feu" },
  { pattern: /Air/i, file: "AirDamage.svg", label: "Air" },
  { pattern: /Neutres?/i, file: "NeutralDamage.svg", label: "Neutre" },
  { pattern: /Force/i, file: "EarthDamage.svg", label: "Force" },
  { pattern: /Intelligence/i, file: "FireDamage.svg", label: "Intelligence" },
  { pattern: /Chance/i, file: "WaterDamage.svg", label: "Chance" },
  { pattern: /Agilité/i, file: "AirDamage.svg", label: "Agilité" },
  { pattern: /Dommages?/i, file: "NeutralDamage.svg", label: "Dommages neutres" },
];

export function TonicEffectIcon({ text }: { text: string }) {
  const icon = TONIC_STAT_ICONS.find((entry) => entry.pattern.test(text));
  if (!icon) return null;
  return <img className="element" src={`assets/img/icons/${icon.file}`} alt={icon.label} />;
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
