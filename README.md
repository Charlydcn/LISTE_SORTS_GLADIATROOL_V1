# Liste des sorts Gladiatrool

Application statique HTML/CSS/JavaScript vanilla, déployable telle quelle sur Vercel.

## Architecture

- Les 13 fichiers `data/*.json` et `MORPH_STATS` dans `assets/js/data.js` sont la **baseline** et restent la source originale.
- Supabase Auth gère les deux comptes administrateurs.
- Supabase stocke uniquement les overrides propriété par propriété, leur historique complet et les commentaires.
- Au démarrage, l'application charge la baseline, récupère les overrides autorisés par la session, puis construit les valeurs effectives en mémoire.
- Il n'y a ni backend applicatif, ni build frontend, ni Realtime.

Tout utilisateur Supabase authentifié est administrateur. Un visiteur non authentifié doit choisir explicitement le mode invité, qui reste actif uniquement dans `sessionStorage`.

## Configuration Supabase

Le frontend est déjà configuré pour le projet `nfruhrvninbkvtnosgwk`. La Project URL et la publishable key sont publiques par conception.

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
- L'historique est un journal d'audit immuable : aucun client ne peut supprimer ses lignes.

## Développement local

Les JSON sont chargés avec `fetch`, il faut donc servir le dossier par HTTP :

```bash
npx serve .
```

Ou, si Python est disponible :

```bash
python -m http.server 8000
```

Ouvrir ensuite l'URL indiquée par le serveur. `file://` ne convient pas.

## Déploiement Vercel

Après application des migrations et configuration des deux utilisateurs, pousser la branche suivie par Vercel. Aucune variable Vercel privée ni modification du mode de déploiement n'est nécessaire : le site reste entièrement statique.

## Secrets

Peuvent être publics dans le frontend :

- Supabase Project URL ;
- Supabase publishable key.

Doivent rester privés :

- mot de passe PostgreSQL ;
- connection string complète contenant ce mot de passe ;
- clé `service_role`.
