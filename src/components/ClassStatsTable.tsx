import { useDataStore } from "../lib/dataStore";
import { displayValue } from "../lib/utils";
import { EditableField } from "./EditableField";
import { ResetButton } from "./ResetButton";
import { ClassIcon } from "./icons";

const STAT_DEFINITIONS: [string, string, string][] = [
  ["vie", "PV", "PV.svg"],
  ["pa", "PA", "PA.svg"],
  ["pm", "PM", "PM.svg"],
  ["initiative", "Initiative", "Ini.svg"],
  ["vitalite", "Vitalité", "Vita.svg"],
  ["sagesse", "Sagesse", "Wisdom.svg"],
  ["force", "Force", "EarthDamage.svg"],
  ["intelligence", "Intelligence", "FireDamage.svg"],
  ["chance", "Chance", "WaterDamage.svg"],
  ["agilite", "Agilité", "AirDamage.svg"],
];

export function ClassStatsTable({ className, compact = false }: { className: string; compact?: boolean }) {
  const stats = useDataStore((s) => s.morphStats[className]);
  if (!stats) return null;
  const elementalTotal = ["force", "intelligence", "chance", "agilite"]
    .reduce((total, key) => total + (Number(stats[key]) || 0), 0);

  return (
    <section className={`class-stats-section${compact ? " class-stats-panel" : ""}`}>
      {!compact ? (
        <div className="panel-heading-row">
          <h3 className="class-stats-title">Caractéristiques</h3>
          <ResetButton scope="class-stats" resetKey={className} />
        </div>
      ) : (
        <div className="class-stats-panel-actions">
          <a
            className="class-stats-panel-name"
            href={`#/sorts/classe/${encodeURIComponent(className)}`}
          >
            {className}
          </a>
          <ResetButton scope="class-stats" resetKey={className} disabledWhenEmpty={false} />
        </div>
      )}
      <div className="class-stats-table">
        <div className="stat-row-cell stat-row-header">
          <span className="stat-cell-icon-wrap class-stat-class-icon" title={className}>
            <ClassIcon className={className} title={className} />
          </span>
          <span className="stat-cell-label">Caractéristique</span>
          <span className="stat-cell-sep"></span>
          <span className="stat-cell-value">Valeur</span>
        </div>
        {STAT_DEFINITIONS.map(([key, label, icon]) => (
          <div className="stat-row-cell" key={key}>
            <span className="stat-cell-icon-wrap">
              <img className="stat-cell-icon" src={`assets/img/icons/${icon}`} alt="" />
            </span>
            <span className="stat-cell-label">{label}</span>
            <span className="stat-cell-sep"></span>
            <span className="stat-cell-value">
              <EditableField
                entityType="class_stat"
                entityKey={className}
                fieldKey={key}
                inputType="number"
              >
                {displayValue(stats[key])}
              </EditableField>
            </span>
          </div>
        ))}
        <div className="class-stats-total" aria-label={`Total élémentaire : ${elementalTotal}`}>
          <span>Total élémentaire</span>
          <strong>{displayValue(elementalTotal)}</strong>
        </div>
      </div>
    </section>
  );
}
