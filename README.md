# My Social Network API

Projet d'API Backend réalisé avec Node.js, Express et MongoDB.
Cette API gère un réseau social complet incluant utilisateurs, groupes, événements, discussions, albums photos, sondages et billetterie.

## Fonctionnalités

* **Authentification** : Inscription, Connexion, JWT, Sécurisation des routes.
* **Utilisateurs** : Gestion de profil, unicité des emails.
* **Groupes** : Création (Public/Privé), gestion des membres, permissions.
* **Événements** : Création, invitation automatique des membres de groupe, validation des dates.
* **Discussions** : Fils de discussion créés automatiquement pour chaque groupe/événement, messages.
* **Albums Photos** : Liés aux événements, ajout de photos par URL.
* **Sondages** : Création par organisateurs, votes des participants.
* **Billetterie** : Gestion des types de billets (stocks) et simulation d'achat.

##  Installation

1.  **Cloner le projet** (ou décompresser l'archive).
2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

##  Configuration

Assurez-vous d'avoir un fichier `.env` à la racine du projet avec les variables suivantes :

```env
PORT=5000
MONGO_URI=votre_lien_mongodb_atlas
JWT_SECRET=votre_secret_jwt

Pour lancer le serveur en mode développement (avec redémarrage automatique) :
npm run dev
Le serveur démarrera sur http://localhost:5000

Il est recommandé d'utiliser Postman pour tester les routes.
Auth : POST /api/auth/register, POST /api/auth/login
Groupes : POST /api/groups, GET /api/groups, POST /api/groups/:id/join
Événements : POST /api/events (Invitation auto si groupe lié)
Threads : POST /api/threads/:id/messages, GET /api/threads/:id
Albums : POST /api/albums, POST /api/albums/:id/photos
Sondages : POST /api/polls, POST /api/polls/:id/vote
Billetterie : POST /api/tickets/setup, POST /api/tickets/buy