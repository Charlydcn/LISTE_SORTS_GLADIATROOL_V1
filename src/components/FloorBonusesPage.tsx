import { TonicEffectIcon } from "./icons";

type Bonus = { label: string; value: number };

const STANDARD_BONUSES: Bonus[] = [
  { label: "Vitalité", value: 250 },
  { label: "Sagesse", value: 50 },
  { label: "Force", value: 50 },
  { label: "Intelligence", value: 50 },
  { label: "Chance", value: 50 },
  { label: "Agilité", value: 50 },
  { label: "Dommages", value: 3 },
  { label: "% Dommages", value: 30 },
  { label: "Soins", value: 5 },
  { label: "Coups critiques", value: 3 },
  { label: "Résistance Terre (%)", value: 1 },
  { label: "Résistance Feu (%)", value: 1 },
  { label: "Résistance Eau (%)", value: 1 },
  { label: "Résistance Air (%)", value: 1 },
  { label: "Résistance Neutre (%)", value: 1 },
];

const EXTRA_BONUSES: Record<number, Bonus[]> = {
  6: [{ label: "PA", value: 1 }],
  8: [{ label: "PA", value: 1 }, { label: "PM", value: 1 }],
  10: [{ label: "% Dommages finaux", value: 100 }, { label: "PA", value: 1 }, { label: "PM", value: 1 }],
};

export function FloorBonusesPage() {
  const totals = new Map<string, number>();
  const floors = Array.from({ length: 9 }, (_, index) => {
    const floor = index + 2;
    const bonuses = [...(EXTRA_BONUSES[floor] ?? []), ...STANDARD_BONUSES];
    bonuses.forEach((bonus) => totals.set(bonus.label, (totals.get(bonus.label) ?? 0) + bonus.value));
    return {
      floor,
      bonuses,
      totals: bonuses.map((bonus) => ({ ...bonus, value: totals.get(bonus.label) ?? 0 })),
    };
  });

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Bonus d’étage</h1>
          <p>Gains passifs obtenus à chaque étage du Gladiatrool.</p>
        </div>
      </div>
      <div className="floor-bonuses-table" role="table" aria-label="Bonus passifs par étage">
        <div className="floor-bonuses-row floor-bonuses-header" role="row">
          <span role="columnheader">Étage</span>
          <span role="columnheader">Gains passifs</span>
        </div>
        {floors.map(({ floor, bonuses, totals: floorTotals }) => (
          <div className="floor-bonuses-row" role="row" key={floor}>
            <strong role="cell">{floor}</strong>
            <ul role="cell">
              {bonuses.map((bonus, index) => (
                <li key={bonus.label}>
                  <TonicEffectIcon text={bonus.label} />
                  <span>{bonus.label} +{bonus.value} <em>(Total : {floorTotals[index].value})</em></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
