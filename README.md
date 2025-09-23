# Project Alive

Ce dépôt contient une application Vite/React. Le déploiement vers GitHub Pages est automatisé via un workflow GitHub Actions situé dans [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Déploiement automatique

Le workflow se déclenche lors d'un `push` sur la branche `main` ainsi que manuellement via `workflow_dispatch`. Il installe Node.js 18, exécute `npm ci`, construit l'application avec `npm run build`, puis publie le contenu du dossier `dist/` sur GitHub Pages.

Après la première exécution du workflow, ouvrez **Settings → Pages** dans GitHub et sélectionnez **GitHub Actions** comme source de publication (ou la branche `gh-pages` si vous changez la stratégie de déploiement). Cette configuration permet de servir l'artefact généré par le workflow.

## Vérifications locales

Avant de pousser des modifications, vous pouvez vérifier que la génération aboutit correctement :

```bash
npm ci
npm run build
```

Il est également recommandé d'exécuter le linting localement pour détecter les éventuels problèmes de style ou d'analyse statique :

```bash
npm run lint
```

Ces commandes vous permettent de valider la qualité du code avant de déclencher le déploiement automatique.
