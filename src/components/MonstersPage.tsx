import { useMemo, useState } from "react";
import monstersCatalog from "../data/monstres.json";

type Monster = {
  monster_id: string;
  nom: string;
  categorie_gladiatrool: string;
  niveau_grade_5: string;
  etages_eligibles: string;
  maps_eligibles: string;
  type_libelle: string;
  source_categorie: string;
};

type SortKey = "nom" | "niveau" | "type";
type SortDirection = "ascending" | "descending";

const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });

function sortValue(monster: Monster, sortKey: SortKey): string | number {
  if (sortKey === "niveau") return Number(monster.niveau_grade_5);
  if (sortKey === "type") return monster.type_libelle;
  return monster.nom;
}

export function MonstersPage() {
  const [sortKey, setSortKey] = useState<SortKey>("nom");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ascending");

  const monsters = useMemo(() => {
    const direction = sortDirection === "ascending" ? 1 : -1;
    return [...(monstersCatalog as Monster[])].sort((left, right) => {
      const leftValue = sortValue(left, sortKey);
      const rightValue = sortValue(right, sortKey);
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return direction * (leftValue - rightValue);
      }
      return direction * collator.compare(String(leftValue), String(rightValue));
    });
  }, [sortDirection, sortKey]);

  function changeSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((direction) => direction === "ascending" ? "descending" : "ascending");
      return;
    }
    setSortKey(key);
    setSortDirection("ascending");
  }

  function sortLabel(key: SortKey, label: string) {
    const isCurrent = sortKey === key;
    const direction = isCurrent && sortDirection === "ascending" ? "croissant" : "décroissant";
    return `Trier par ${label}${isCurrent ? `, ordre ${direction}` : ""}`;
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Monstres</h1>
          <p>{monsters.length} monstres disponibles dans le pool Gladiatrool.</p>
        </div>
      </div>
      <div className="monsters-table-wrapper">
        <table className="monsters-table">
          <thead>
            <tr>
              <th aria-sort={sortKey === "nom" ? sortDirection : "none"}>
                <button type="button" onClick={() => changeSort("nom")} aria-label={sortLabel("nom", "Nom")}>Nom</button>
              </th>
              <th aria-sort={sortKey === "niveau" ? sortDirection : "none"}>
                <button type="button" onClick={() => changeSort("niveau")} aria-label={sortLabel("niveau", "Niveau")}>Niveau</button>
              </th>
              <th aria-sort={sortKey === "type" ? sortDirection : "none"}>
                <button type="button" onClick={() => changeSort("type")} aria-label={sortLabel("type", "Type")}>Type</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {monsters.map((monster) => (
              <tr key={monster.monster_id}>
                <td><a href={`https://solomonk.fr/fr/monstre/${monster.monster_id}`} target="_blank" rel="noreferrer">{monster.nom}</a></td>
                <td>{monster.niveau_grade_5}</td>
                <td>{monster.type_libelle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
