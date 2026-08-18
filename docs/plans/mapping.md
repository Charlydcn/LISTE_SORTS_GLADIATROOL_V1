# Mapping MD → JSON (Gladiatrool)

## Source
[`GLADIATROOL_REBALANCING.md`](../GLADIATROOL_REBALANCING.md), section « 2. Sorts Gladiatrool par classe ».

## Fichiers générés (dans `data/`)
- 12 fichiers de classe : `feca.json`, `osamodas.json`, `enutrof.json`, `sram.json`,
  `xelor.json`, `ecaflip.json`, `eniripsa.json`, `iop.json`, `cra.json`,
  `sadida.json`, `sacrieur.json`, `pandawa.json`.
- 1 fichier de sorts communs : `sortsCommuns.json`.

## Structure d'un fichier de classe
```json
{
  "classe": "Feca",
  "morphId": 101,
  "sorts": [ /* 22 sorts */ ]
}
```

## Structure d'un sort
```json
{
  "id": 2,
  "position": 2,
  "nom": "Aveuglement",
  "pa": 3,
  "po": "1–8",
  "porteeModifiable": true,
  "lancerEnLigne": false,
  "ligneDeVue": true,
  "cc": "1/50",
  "ec": "1/100",
  "relance": "-",
  "parTour": 0,
  "parCible": 1,
  "icone": "assets/img/spells/2.svg",
  "commun": false,
  "effets": [
    { "onglet": "normaux", "texte": "Dommage Neutre : 6 à 15 (Point)" },
    { "onglet": "critiques", "texte": "Dommage Neutre : 16 (Point)" }
  ]
}
```

## Correspondance colonnes MD → champs
| Colonne MD | Champ JSON | Type |
|---|---|---|
| ID | `id` | number |
| Pos. | `position` | number |
| Nom | `nom` | string |
| PA | `pa` | number |
| PO | `po` | string (ex. `1–8`, `0–0`) |
| Portée modifiable | `porteeModifiable` | boolean |
| Lancer en ligne | `lancerEnLigne` | boolean |
| Ligne de vue nécessaire | `ligneDeVue` | boolean |
| CC | `cc` | string |
| EC | `ec` | string |
| Relance | `relance` | string (`-` si `—`) |
| Par tour | `parTour` | number \| null |
| Par cible | `parCible` | number \| null |
| Effets | `effets` | array `{ onglet, texte }` |

## Règles
- **Sorts communs** (IDs 350, 364, 366, 367, 368, 369, 370, 373) : extraits une seule fois
  dans `sortsCommuns.json`, `icone: null`, `commun: true`. Exclus des fichiers de classe.
- **22 sorts par classe** : 20 propres + maîtrise (pos. 29) + ultime (pos. 30).
- **Effets** : 1 bloc MD = 1 ligne `Nom : valeur (Zone)`. Onglet `normaux`/`critiques`
  selon préfixe `Norm`/`CC`. Séparateur d'effets `;`, séparateur Norm/CC `<br>`.
- **Zones** : `Point (taille 0)` → `(Point)` ; `Cercle (taille N)` → `(Cercle N)` ;
  `Croix (taille N)` → `(Croix N)` ; `Ligne (taille N)` → `(Ligne N)`.
- **Placeholders** : `X` et `Y` dans les libellés → `TODO`.
- **Noms normalisés** : Xel→Xelor, Eca→Ecaflip, Eni→Eniripsa, Cra→Crâ,
  Sadi→Sadida, Sacri→Sacrieur, Panda→Pandawa.
- **Tirets** : `—` (em dash) → `-`.
- **Champs supprimés** (absents du MD) : `niveauRequis`, `niveauxDisponibles`,
  `niveauActif`, `description`, `breadcrumb`, `ccActuels`, `cellulesLibres`, `ecFiniLeTour`.
