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
type Category = "all" | "NORMAL" | "BOSS" | "ARCHIMONSTRE";

const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });
const FLOORS = Array.from({ length: 10 }, (_, index) => index + 1);
const CATEGORY_LABELS: Record<Exclude<Category, "all">, string> = {
  NORMAL: "Mobs normaux",
  BOSS: "Boss",
  ARCHIMONSTRE: "Archimonstres",
};

function sortValue(monster: Monster, sortKey: SortKey): string | number {
  if (sortKey === "niveau") return Number(monster.niveau_grade_5);
  if (sortKey === "type") return monster.type_libelle;
  return monster.nom;
}

export function MonstersPage() {
  const [sortKey, setSortKey] = useState<SortKey>("nom");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ascending");
  const [floor, setFloor] = useState("all");
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");

  const monsters = useMemo(() => {
    const direction = sortDirection === "ascending" ? 1 : -1;
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return (monstersCatalog as Monster[]).filter((monster) => {
      const matchesFloor = floor === "all" || monster.etages_eligibles.split(",").includes(floor);
      const matchesCategory = category === "all" || monster.categorie_gladiatrool === category;
      const searchableText = `${monster.nom} ${monster.niveau_grade_5} ${monster.type_libelle}`.toLocaleLowerCase("fr");
      return matchesFloor && matchesCategory && searchableText.includes(normalizedQuery);
    }).sort((left, right) => {
      const leftValue = sortValue(left, sortKey);
      const rightValue = sortValue(right, sortKey);
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return direction * (leftValue - rightValue);
      }
      return direction * collator.compare(String(leftValue), String(rightValue));
    });
  }, [category, floor, query, sortDirection, sortKey]);

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
          <p>{monsters.length} monstre{monsters.length > 1 ? "s" : ""} dans cette sélection.</p>
        </div>
      </div>
      <div className="monsters-filters" aria-label="Filtres des monstres">
        <label>
          Pool
          <select value={floor} onChange={(event) => setFloor(event.target.value)}>
            <option value="all">Pool complet</option>
            {FLOORS.map((value) => <option key={value} value={value}>Étage {value}</option>)}
          </select>
        </label>
        <label>
          Catégorie
          <select value={category} onChange={(event) => setCategory(event.target.value as Category)}>
            <option value="all">Toutes les catégories</option>
            {(Object.keys(CATEGORY_LABELS) as Exclude<Category, "all">[]).map((value) => <option key={value} value={value}>{CATEGORY_LABELS[value]}</option>)}
          </select>
        </label>
        <label className="monsters-search">
          Rechercher
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, niveau ou type" />
        </label>
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
            {monsters.length === 0 ? <tr><td colSpan={3} className="monsters-empty">Aucun monstre ne correspond aux filtres.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
