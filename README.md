# MétéOu V2 - Assemblée Dashboard

Un tableau de bord complet, moderne et temps réel pour l'analyse des scrutins et de l'activité des députés lors de la 17ème législature de l'Assemblée Nationale française.

## Fonctionnalités Principales

- **Dashboard Global** : Résumé des présences, statistiques globales.
- **Visualisations** : Matrice d'alignement (Heatmap) et classement des "Victoires par groupe".
- **Députés** : Moteur de recherche, affichage visuel du taux de présence individuel, de fidélité au sein de leur groupe, et historique de rébellion ("Votes rebelles").
- **Groupes Politiques** : Listing exhaustif et pages dédiées pour visualiser l'alignement des membres d'un parti.
- **Scrutins Publics** : Détails des répartitions de chaque vote avec l'issue finale des textes.
- **Moteur de Temps Dynamique** : Filtrez toute l'interface sur les 30 derniers jours, 90 derniers jours, sur une année spécifique, ou bien sur des dates personnalisées calculées en temps réel dans le navigateur !
- **Bouton d'Actualisation Intégré** : Plus besoin de lancer la ligne de commande, le tableau de bord intègre un bouton qui déclenche le téléchargement, le scraping dynamique multi-page de l'open data et met à jour l'application sans friction.

## Architecture

L'architecture est construite autour de deux briques très légères :
1. **Pipeline de traitement (Data)** : Scripts Python téléchargeant l'Open-Data, scrapant les résultats manquants et compilant les statistiques de base.
2. **Dashboard Web (Frontend)** : Interface web statique en **React.js (Vite)** au style néomorphisme moderne (Glassmorphism).

## 🚀 Installation & Lancement

Ce projet nécessite **Node.js** (npm) et **Python 3**.

### Étape 1 : Le Pipeline de données (Python)
L'interface a besoin de données à afficher. Récupérez les derniers scrutins :

```bash
cd assemblee_dashboard/pipeline
pip install beautifulsoup4
python updater.py
```
*(Ceci téléchargera l'intégralité de l'historique dans `/dashboard/public/db.json`)*

### Étape 2 : Le Tableau de Bord (React / Vite)
Installez les dépendances et lancez le serveur de développement :

```bash
cd assemblee_dashboard/dashboard
npm install
npm run dev
```

Une fois le serveur `Vite` lancé (généralement sur `http://localhost:5173`), vous pouvez utiliser le bouton "Actualiser les données" en haut à droite du site à l'avenir pour lancer automatiquement le script Python de l'étape 1 en arrière plan !
