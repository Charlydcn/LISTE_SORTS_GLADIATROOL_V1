# Export et import des sorts

## Objectif

L’export fournit un instantané des valeurs actuellement visibles. Il ne contient ni historique,
ni commentaires, ni distinction de traitement entre les sorts natifs et personnalisés. Le champ
`origine` reste présent pour permettre à un outil serveur de choisir entre une mise à jour et une
création. Les sorts supprimés ne figurent pas dans l’export.

`formatVersion: 1` identifie la structure décrite ici. Un importeur doit refuser une version qu’il
ne connaît pas : cela évite qu’une évolution future du JSON soit interprétée avec de mauvaises
règles.

## Archives

- Sort unique : `config.json` et `icones/` avec l’icône du sort.
- Classe ou sorts communs : `config.json` et `icones/` avec toutes les icônes visibles.
- Global : `manifest.json`, `classes/<classe>/config.json`, les dossiers `icones/` associés, puis
  `sorts-communs/config.json` et son dossier d’icônes.

L’archive n’est téléchargée que lorsque toutes les icônes ont pu être récupérées. Les fichiers
conservent leur format SVG, PNG, JPEG ou WebP sans conversion.

## Structure de `config.json`

```json
{
  "format": "gladiatrool-spells",
  "formatVersion": 1,
  "scope": "class",
  "exporteLe": "2026-08-22T12:00:00.000Z",
  "classe": {
    "nom": "Iop",
    "morphId": 108,
    "caracteristiques": {
      "vie": 850,
      "pa": 8
    }
  },
  "sorts": [
    {
      "id": 141,
      "position": 1,
      "origine": "native",
      "nom": "Pression",
      "pa": 2,
      "po": "1–2",
      "porteeModifiable": false,
      "lancerEnLigne": false,
      "ligneDeVue": true,
      "cc": "1/40",
      "ec": "1/100",
      "relance": "-",
      "parTour": 0,
      "parCible": 0,
      "commun": false,
      "effets": [],
      "classe": "Iop",
      "icone": {
        "fichier": "icones/141-pression.svg",
        "format": "svg",
        "typeMime": "image/svg+xml"
      }
    }
  ]
}
```

Les caractéristiques sont volontairement isolées dans `classe.caracteristiques`. La collection
`sorts` est donc exploitable indépendamment pour générer les enregistrements d’un serveur privé.

## Import

Le bouton global **Importer** accepte un `config.json` ou une archive ZIP produite par l’un des
exports. Les images présentes dans l’archive sont ignorées.

L’import :

- est réservé à un utilisateur authentifié ;
- fusionne les données sans supprimer les sorts absents ;
- met à jour un sort natif reconnu par son couple classe/identifiant ;
- crée ou met à jour un sort personnalisé en conservant son identifiant `1000000+` ;
- conserve les icônes actuellement enregistrées sur le site ;
- s’exécute dans une transaction PostgreSQL unique ;
- écrit au maximum une ligne d’historique, contenant le récapitulatif des classes modifiées.

La taille maximale du fichier d’import est de 25 Mo. Une erreur de format, d’identifiant ou de
donnée annule l’intégralité de l’import.
