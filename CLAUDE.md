# Scott Law Intranet

## Mémoire projet

Le projet est une application web intranet RP pour le cabinet d’avocat Scott Law, développée en Next.js App Router, TypeScript, TailwindCSS, Prisma, PostgreSQL et Auth.js avec OAuth2 Discord.

## Règles absolues validées

- Aucun commentaire dans le code.
- Aucune architecture, dépendance, route, table, composant partagé, workflow UX ou choix visuel important sans validation préalable.
- Aucune balise HTML `<form>`.
- Aucun `window.alert`, `window.confirm` ou `window.prompt`.
- Toutes les notifications passent par le système de toasts.
- URLs propres sans extension.
- Interface responsive de 320px à l’ultrawide.
- Sécurité par défaut avec validation serveur, rôles serveur et variables sensibles dans `.env`.
- Aucune image ajoutée sans validation explicite.
- Le logo fourni valide la direction noir profond et or.

## Architecture V1 validée

- Projet local dans `scott-law-intranet`.
- Package manager cible : `pnpm`.
- UI : TailwindCSS pur avec icônes Lucide autorisées.
- Stockage documentaire V1 : stockage local dans `public/uploads`.
- Hébergement VPS prévu plus tard.

## Fonctionnalités V1 implémentées

- Accueil publique avec présentation, tarifs, actualités, avis clients et connexion Discord.
- Page recrutement avec candidature contrôlée côté client et stockage en base.
- Auth.js Discord OAuth2 avec PrismaAdapter, JWT session et rôles internes.
- Middleware de protection des routes.
- Dashboard adapté au rôle.
- Consultation des clients.
- Gestion entreprises avec création, modification, consultation, membres et compteurs dossiers/documents.
- Dépôt documentaire local, liste, statut et rattachement client/entreprise.
- Rendez-vous avec création de créneaux et réservation.
- Factures simples avec statut payée ou impayée et totaux.
- Base de connaissances interne avec catégories et articles.
- Interface admin pour consulter les candidatures.

## Points d’attention avant prochaine feature

Relire ce fichier avant toute nouvelle feature, résumer les impacts potentiels en 2 à 3 lignes, proposer l’architecture puis attendre validation.

Les futures automatisations prévues sont la synchronisation des rôles Discord, les notifications Discord, la génération PDF depuis templates et les relances automatiques par mail.
