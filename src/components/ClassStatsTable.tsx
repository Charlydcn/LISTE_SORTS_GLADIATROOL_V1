import { useDataStore } from "../lib/dataStore";
import { displayValue } from "../lib/utils";
import { EditableField } from "./EditableField";
import { ResetButton } from "./ResetButton";

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

export function ClassStatsTable({ className }: { className: string }) {
  const stats = useDataStore((s) => s.morphStats[className]);
  if (!stats) return null;

  return (
    <section className="class-stats-section">
      <div className="panel-heading-row">
        <h3 className="class-stats-title">Caractéristiques</h3>
        <ResetButton scope="class-stats" resetKey={className} />
      </div>
      <div className="class-stats-table">
        <div className="stat-row-cell stat-row-header">
          <span className="stat-cell-icon-wrap"></span>
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
      </div>
    </section>
  );
}
