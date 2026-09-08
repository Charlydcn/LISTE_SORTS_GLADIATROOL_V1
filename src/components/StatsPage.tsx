import { CLASSES } from "../lib/dataService";
import { ExportCharacteristicsButton } from "./SpellTransferActions";
import { ClassStatsTable } from "./ClassStatsTable";
import { useSessionStore } from "../lib/sessionStore";

export function StatsPage() {
  const isAdmin = useSessionStore((s) => s.mode) === "admin";

  return (
    <div className="stats-page">
      <div className="panel-heading-row stats-page-heading">
        <h2>Caractéristiques</h2>
        {isAdmin ? <ExportCharacteristicsButton /> : null}
      </div>
      <div className="class-stats-grid">
        {CLASSES.map((className) => (
          <ClassStatsTable key={className} className={className} compact />
        ))}
      </div>
    </div>
  );
}
