# Liste des sorts Gladiatrool

Application de listing des sorts Dofus Retro, refactorisée en **Vite + React 18 + TypeScript 5**, déployable telle quelle sur Vercel (build statique pur).

## Stack

- **Vite 5** (bundler + dev server) avec `@vitejs/plugin-react`
- **React 18** (composants, hooks) + `react-dom`
- **TypeScript 5** (typé, `strict`)
- **react-router-dom 6** en `HashRouter` (routes `#/` et `#/classe/:classe`, compatibles avec les URL existantes)
- **Zustand 4** (stores : session, données/overrides, historique, modal, toasts)
- **@supabase/supabase-js** (importé et bundlé, plus de script CDN)

## Architecture

- Les 13 fichiers `public/data/*.json` et `MORPH_STATS` dans [`src/lib/dataService.ts`](src/lib/dataService.ts) sont la **baseline** et restent la source originale.
- `public/assets/css/style.css` est importé **tel quel** (aucune modification CSS) via `<link>` dans [`index.html`](index.html) pour garantir un rendu identique.
- `public/assets/img/` contient les SVG (260 sorts, 12 classes, 11 icônes).
- Supabase Auth gère les deux comptes administrateurs.
- Supabase stocke uniquement les overrides propriété par propriété, leur historique complet et les commentaires.
- Au démarrage, l'application charge la baseline, récupère les overrides autorisés par la session, puis construit les valeurs effectives en mémoire.
- Il n'y a ni backend applicatif, ni Realtime. Le build produit un site entièrement statique.

Tout utilisateur Supabase authentifié est administrateur. Un visiteur non authentifié doit choisir explicitement le mode invité, qui reste actif uniquement dans `sessionStorage`.

## Scripts npm

```bash
npm install       # installer les dépendances
npm run dev       # serveur de développement Vite (HMR)
npm run build     # build de production : tsc && vite build → dist/
npm run preview   # prévisualiser le build de production
```

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

Avec la CLI Supabase :

```bash
npx supabase@latest login
npx supabase@latest link --project-ref nfruhrvninbkvtnosgwk
npx supabase@latest db push
```

La CLI demande le mot de passe PostgreSQL lors du lien si nécessaire. En connexion directe avec `psql`, le format est :

```text
postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.nfruhrvninbkvtnosgwk.supabase.co:5432/postgres
```

Conserver le mot de passe dans `.env.local` (ignoré par Git) ou dans une variable d'environnement, jamais dans la commande enregistrée ou dans un fichier versionné.

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
