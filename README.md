# Project-Alive

## Déploiement sur GitHub Pages

Le dépôt est configuré pour publier automatiquement le contenu généré dans `dist/` sur GitHub Pages.

### Pré-requis

- La commande `npm run build` doit réussir : elle est utilisée par le workflow pour produire les fichiers statiques à déployer.
- (Optionnel) Disposez d'une installation locale de Node.js et npm pour lancer la construction avant de pousser vos changements.

### Procédure de déploiement

1. Poussez vos commits sur la branche `main`.
2. Le workflow GitHub Actions "Deploy to GitHub Pages" s'exécute automatiquement :
   - installation des dépendances avec `npm ci` ;
   - construction du projet via `npm run build` ;
   - chargement des fichiers du dossier `dist/` grâce à `actions/upload-pages-artifact` ;
   - publication de l'artefact avec `actions/deploy-pages` sur l'environnement `github-pages`.
3. Lors de la première mise en place, activez GitHub Pages dans **Settings → Pages** en sélectionnant *GitHub Actions* comme source. La branche de déploiement (`gh-pages` gérée par Pages build) sera alimentée automatiquement par le workflow.

Une fois le workflow terminé avec succès, la dernière URL de déploiement est disponible dans l'onglet **Deployments** du dépôt.
