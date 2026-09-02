# Liste des sorts Gladiatrool

Application collaborative de listing des sorts, toniques et mutations Dofus Retro, refactorisée en **Vite + React 18 + TypeScript 5**, déployable telle quelle sur Vercel (build statique pur).

## Audit catalogue ↔ serveur Dofus : guide d’utilisation

### Le besoin

Le catalogue est le support d’équilibrage : ses fiches peuvent être modifiées sans que le serveur Dofus soit automatiquement modifié. Une fiche du catalogue n’est pas nécessairement le même sort que celui utilisé par le serveur : une fiche native peut représenter un sort serveur personnalisé qui remplace un sort vanilla.

L’objectif est donc de détecter de façon fiable les écarts entre le catalogue et les sorts Gladiatrool réellement actifs, sans jamais laisser le site écrire dans MariaDB, Java ou Flash.

### La solution

Le catalogue produit un export d’audit JSON v2. Le projet Dofus lit ensuite cet export et compare les données à l’état du serveur en lecture seule. Le flux est volontairement à sens unique :

```text
Catalogue + Supabase ── export JSON ──> outil d’audit du projet Dofus
                                         │
                                         └── rapport d’écarts à examiner
```

Le site **ne se connecte pas** au PC serveur Dofus et ne lit pas directement sa base MariaDB. Le futur outil du dépôt Dofus est responsable de lire MariaDB, `full_morphs` et les données réellement actives.

### Les mappings : le carnet d’adresses

Un mapping relie une fiche du catalogue au sort actif côté serveur. Il ne modifie ni la fiche, ni son historique, ni le serveur.

| Champ | Rôle |
| --- | --- |
| `catalogueSpellId` | ID stable de la fiche dans le catalogue. |
| `serverSpellId` | ID du sort effectivement lu dans `spells` côté serveur. |
| `replacesServerSpellId` | Sort vanilla/serveur qui doit être absent de la morph lorsqu’il est remplacé ; sinon `null`. |
| `origine` | `native_inchange`, `native_modifie`, `personnalise` ou `non_configuree`. |
| `shortcutPosition` | Position de raccourci de `full_morphs.spells`, convertie de l’hexadécimal en entier décimal. Ce n’est pas le rang visuel de la fiche. |

Exemple : une fiche catalogue `#66` peut être liée au sort serveur `#10000`, lequel remplace `#66` dans la morph.

### État actuel

- 255 mappings certains ont été importés.
- 12 sorts personnalisés restent volontairement `non_configuree` : aucune correspondance n’a été déduite.
- Les 8 sorts communs restent hors de cet import initial.
- La fonction publique de lecture seule est disponible à l’adresse :
  `https://nfruhrvninbkvtnosgwk.supabase.co/functions/v1/export-gladiatrool-v2`.

### Utilisation, étape par étape

1. Modifiez normalement les sorts dans le catalogue. L’historique existant continue de fonctionner sans changement.
2. Pour une exception de mapping, connectez-vous en administrateur, ouvrez la fiche puis dépliez **Synchronisation serveur**. Corrigez uniquement les IDs et la position fournis par l’analyse du projet Dofus.
3. Cliquez sur **Export audit v2** dans la barre supérieure pour télécharger l’état effectif actuel du catalogue.
4. Donnez ce JSON à l’outil ou à l’IA du projet Dofus. Il doit lire le serveur en lecture seule, résoudre les morphs actifs et produire un rapport : identique, différent, absent, ou non comparable.
5. Appliquez les corrections côté Dofus uniquement après analyse : SQL, Java ou Flash selon le cas. Le JSON n’écrit jamais sur le serveur.
6. Relancez ensuite l’audit pour vérifier le résultat.

### Limites actuelles

- Les effets sont exportés comme texte informatif. Ils ne constituent pas encore une comparaison technique fiable des effets SQL/Java/Flash.
- Le rapport d’audit côté projet Dofus doit encore être finalisé puis éventuellement réimporté dans le catalogue pour afficher un statut visuel `synchronisé` / `différent` sur chaque fiche.
- Les mappings et l’endpoint sont publics, car le catalogue GitHub et son export sont publics. Ne placez jamais de mots de passe MariaDB, clés `service_role` ou secrets de déploiement dans cet export.

## Stack

- **Vite 5** (bundler + dev server) avec `@vitejs/plugin-react`
- **React 18** (composants, hooks) + `react-dom`
- **TypeScript 5** (typé, `strict`)
- **react-router-dom 6** en `HashRouter` (`#/sorts`, `#/toniques`, `#/mutations` et leurs pages détaillées)
- **Zustand 4** (stores : session, données/overrides, historique, modal, toasts)
- **@supabase/supabase-js** (importé et bundlé, plus de script CDN)

## Architecture

- Les fichiers `public/data/*.json`, dont `toniques.json`, et `MORPH_STATS` dans [`src/lib/dataService.ts`](src/lib/dataService.ts) sont la **baseline** et restent la source originale.
- `public/data/toniques.json` contient 25 toniques et 240 mutations natives ; le dossier de dump source n'est pas nécessaire au fonctionnement.
- `public/assets/css/style.css` est importé via `<link>` dans [`index.html`](index.html).
- `public/assets/img/` contient les SVG (260 sorts, 12 classes, 11 icônes).
- Supabase Auth gère les deux comptes administrateurs.
- Supabase stocke uniquement les overrides propriété par propriété, leur historique complet et les commentaires.
- Les administrateurs peuvent remplacer l'icône d'un sort par un fichier SVG, PNG, JPEG ou WebP de 2 Mo maximum. Les icônes personnalisées sont stockées dans le bucket public Supabase `spell-images` ; les icônes JSON locales restent la référence de réinitialisation.
- Au démarrage, l'application charge la baseline, récupère les overrides autorisés par la session, puis construit les valeurs effectives en mémoire.
- Les fichiers JSON et les réponses Supabase critiques sont validés à l'exécution avant d'alimenter les stores.
- Il n'y a ni backend applicatif, ni Realtime. Le build produit un site entièrement statique.

Les sorts `390`, `391`, `393` et `395` apparaissent dans deux classes chacun. Leur identifiant est volontairement global : une modification effectuée depuis une classe est donc visible dans l'autre. Le chargement échoue explicitement si deux définitions JSON partageant un identifiant divergent.

Tout utilisateur Supabase authentifié est administrateur. Un visiteur non authentifié doit choisir explicitement le mode invité, qui reste actif uniquement dans `sessionStorage`.

## Scripts npm

```bash
npm install       # installer les dépendances
npm run dev       # serveur de développement Vite (HMR)
npm run build     # build de production : tsc && vite build → dist/
npm run preview   # prévisualiser le build de production
npm test -- --run # tests unitaires et d'intégration frontend, une fois
npm run test:watch # tests frontend en surveillance
npm run test:coverage # mêmes tests avec rapport coverage/ et résumé terminal
npm run test:db   # tests pgTAP sur Supabase local uniquement
npm run test:e2e  # parcours Playwright Chromium (Supabase local requis)
```

## Export et import des sorts

Les utilisateurs authentifiés peuvent exporter un sort, une classe, les sorts communs ou tout le
site. Chaque export est une archive ZIP contenant les valeurs finales en JSON et les icônes dans
leur format original. L’import central accepte ces ZIP ou un `config.json`, ignore les images et
applique les données dans une transaction unique. Le format et ses garanties sont documentés dans
[`docs/EXPORT_IMPORT_SORTS.md`](docs/EXPORT_IMPORT_SORTS.md).

## Tests automatisés

Les tests Vitest couvrent les validateurs JSON et réponses Supabase, les stores Zustand,
les sessions, les overrides/réinitialisations, l'historique, les commentaires et l'état
d'erreur visible de l'application. Supabase est toujours mocké à la frontière
`src/lib/supabase.ts` : aucun test frontend ne contacte un projet distant.

Les tests PostgreSQL se trouvent dans `supabase/tests/database/` et utilisent pgTAP via
la CLI Supabase. Ils vérifient les migrations, les privilèges anon/authenticated, les RPC,
l'historique et les champs système des commentaires. Le fichier `supabase/seed.sql` ne
crée qu'un utilisateur de test local (`admin@example.test` / `admin-test-password`).

Prérequis pour la base et les E2E : Docker Desktop lancé, puis une instance Supabase
locale non liée à un projet distant.

```powershell
npx supabase start
npm run test:db

# Copier l'anon key affichée par `npx supabase status -o env` dans la variable suivante.
$env:E2E_RUN_LOCAL = "1"
$env:E2E_SUPABASE_URL = "http://127.0.0.1:54321"
$env:E2E_SUPABASE_ANON_KEY = "<anon-key-locale>"
npx playwright install chromium
npm run test:e2e
```

`test:db` et les E2E ne démarrent jamais `db reset`, `db push`, `link` ni une connexion
à une base distante. Sans `E2E_RUN_LOCAL=1` et une anon key locale, les scénarios
Playwright sont volontairement ignorés.

## Configuration Supabase

Le frontend est déjà configuré pour le projet `nfruhrvninbkvtnosgwk`. La Project URL et la publishable key sont publiques par conception, fournies via les variables d'environnement Vite :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Copier [`.env.example`](.env.example) vers `.env.local` (ignoré par Git) avec les vraies valeurs :

```bash
cp .env.example .env.local
```

Les migrations :

1. Appliquer dans l'ordre tous les fichiers de `supabase/migrations/` qui ne sont pas encore présents sur la base distante.
2. Dans Supabase Dashboard, créer manuellement les deux utilisateurs dans **Authentication > Users**.
3. Dans les réglages Authentication, désactiver les nouvelles inscriptions publiques (« Allow new users to sign up »). L'application ne propose de toute façon aucun écran d'inscription.

La migration `005_spell_images.sql` crée le bucket public `spell-images`, autorise les comptes authentifiés à y ajouter ou supprimer des fichiers et ajoute l'override `icone` sans historique. Elle doit être appliquée avant d'utiliser le bouton **Modifier** affiché sur l'icône d'un sort. Le remplacement et la réinitialisation ne suppriment jamais les fichiers présents dans `public/assets/img/`.

La migration `014_tonics_catalog.sql` ajoute le cycle de vie collaboratif des toniques et mutations : création, suppression/restauration des natifs, overrides, historique et commentaires.

Pour le développement et les tests, utiliser uniquement `supabase/config.toml` et
`npx supabase start` local. Les opérations de liaison, de push ou de reset d'une base
distante ne font pas partie de ce dépôt ni de ses scripts de test.

## Modèle de sécurité

- `anon` peut lire uniquement `public_entity_overrides` et `public_change_history`, deux vues qui excluent les UUID et libellés des auteurs.
- `anon` n'a aucun droit sur les tables sources ni sur `spell_comments`.
- `authenticated` peut lire les auteurs, exécuter les écritures métier atomiques et gérer tous les commentaires.
- Les identités et dates système sont déterminées côté PostgreSQL depuis le JWT signé (`auth.uid()` / email), jamais depuis une valeur libre du navigateur.
- L'historique est créé par les RPC métier. Un administrateur peut supprimer une ligne d'historique depuis l'interface, sans modifier la valeur active.

## Développement local

```bash
npm install
npm run dev
```

Vite sert automatiquement l'application sur une URL HTTP locale (par défaut `http://localhost:5173`). `file://` ne convient pas.

## Déploiement Vercel

Après application des migrations et configuration des deux utilisateurs, pousser la branche suivie par Vercel. Vercel détecte automatiquement Vite (framework preset) et exécute `npm run build`, le répertoire de sortie étant `dist/`.

Aucune variable Vercel privée ni modification du mode de déploiement n'est nécessaire : le site reste entièrement statique. Pour que l'application fonctionne en production, les deux variables publiques `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` doivent être définies au moment du build (via `.env.local`, `.env` ou les variables d'environnement Vercel).

## Secrets

Peuvent être publics dans le frontend :

- Supabase Project URL ;
- Supabase publishable key.

Doivent rester privés :

- mot de passe PostgreSQL ;
- connection string complète contenant ce mot de passe ;
- clé `service_role`.
