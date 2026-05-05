# Scott Law Intranet

Application web intranet RP pour le cabinet d’avocat Scott Law.

## Stack

- Next.js App Router
- TypeScript
- TailwindCSS
- Prisma
- PostgreSQL
- Auth.js avec Discord OAuth2

## Installation

```bash
pnpm install
```

## Configuration Discord OAuth2

1. Créer une application sur le portail développeur Discord.
2. Ajouter une URL de redirection OAuth2 :

```text
http://localhost:3000/api/auth/callback/discord
```

3. Copier le Client ID dans `AUTH_DISCORD_ID`.
4. Copier le Client Secret dans `AUTH_DISCORD_SECRET`.

## Variables d’environnement

Créer un fichier `.env` à partir de `.env.example`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/scott_law?schema=public"
AUTH_SECRET="change-me-with-auth-secret"
AUTH_URL="http://localhost:3000"
AUTH_DISCORD_ID="discord-client-id"
AUTH_DISCORD_SECRET="discord-client-secret"
DOCUMENT_STORAGE_PATH="./public/uploads"
```

Générer une valeur robuste pour `AUTH_SECRET`.

## Base de données

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

## Lancement local

```bash
pnpm dev
```

Puis ouvrir :

```text
http://localhost:3000
```

## Tests

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

La suite complète prévue :

```bash
pnpm test:all
```

## Déploiement VPS

Prévoir sur le VPS :

- Node.js compatible Next.js.
- PostgreSQL.
- Variables d’environnement configurées côté serveur.
- Reverse proxy HTTPS.
- `AUTH_URL` configuré avec le domaine final.
- Nouvelle URL de redirection Discord :

```text
https://votre-domaine.fr/api/auth/callback/discord
```

## Fonctionnalités V1

- Accueil publique Scott Law.
- Connexion Discord OAuth2.
- Création automatique des utilisateurs.
- Rôles `ADMIN`, `AVOCAT`, `MANAGER`, `CLIENT`, `PATRON_ENTREPRISE`.
- Dashboards par rôle.
- Consultation des clients.
- Gestion entreprises.
- Gestion documentaire locale.
- Rendez-vous.
- Factures simples sans paiement.
- Base de connaissances interne.
- Recrutement et consultation admin.

## Évolutions prévues

- Synchronisation des rôles Discord.
- Notifications Discord.
- Génération automatique de PDF.
- Relances automatiques par mail.
