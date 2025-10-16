Description

Cette application permet de recevoir des mails en temps réel depuis un workflow n8n vers une application mobile Expo. Les mails sont envoyés à un serveur Node.js qui les diffuse immédiatement à l'application grâce à Socket.io.

Fonctionnalités principales :

Réception de mails instantanée via Socket.io.

Affichage de la liste des mails et visualisation des détails d’un mail.

Possibilité de tester avec n’importe quel workflow n8n.

Compatible avec serveur local ou serveur en ligne (Firebase, VPS, etc.).

Structure du projet
n8n-App/
├─ App/
│  ├─ App.tsx                 # Entrée principale de l'app Expo
│  ├─ screens/
│  │  ├─ MailList.tsx         # Liste des mails
│  │  └─ MailDetail.tsx       # Détail d’un mail
│  └─ services/
│     └─ mailService.ts       # Fetch initial des mails
├─ server/
│  └─ server.js               # Serveur Node.js + Socket.io
└─ README.md

Prérequis

Node.js ≥ 18

npm

Expo CLI (npm install -g expo-cli)

n8n pour gérer les workflows de mails

ngrok pour exposer le serveur local (optionnel pour tests externes)

Installation
1️⃣ Serveur Node.js
cd server
npm install express cors socket.io
node server.js


Serveur local sur http://localhost:3000

Exposez avec ngrok si vous voulez accéder depuis l’extérieur :

ngrok http 3000

2️⃣ Application Expo
cd App
npm install
npx expo start


Assurez-vous de mettre l’URL correcte de votre serveur (local ou ngrok) dans services/mailService.ts et MailList.tsx.

3️⃣ n8n

Créez un workflow avec un trigger (ex: mail reçu).

Ajoutez un HTTP Request node :

Method: POST
URL: <adresse du serveur>/mails
Body: JSON


Exemple de corps JSON :

{
  "from": "alice@example.com",
  "subject": "Bonjour",
  "body": "Contenu du mail",
  "date": "2025-10-13T09:00:00Z"
}


Chaque mail envoyé sera instantanément reçu dans l'app Expo via Socket.io.

Utilisation

Ouvrir l’app Expo → voir la liste des mails.

Cliquer sur un mail → voir les détails du mail.

Nouveaux mails envoyés via n8n apparaissent immédiatement sans relancer l'app.

Notes

Pour un serveur en ligne, changez simplement l’URL dans mailService.ts et MailList.tsx.

L’application gère les mails longs et courts avec scroll.

Stockage actuel : mémoire temporaire sur le serveur. Pour la production, utiliser une base de données (MongoDB, Firebase, etc.).

Débogage

Si les mails n’apparaissent pas, vérifier :

URL correcte dans fetchMails() et Socket.io.

Le workflow n8n envoie bien les mails au serveur.

Le serveur Node.js est bien lancé (node server.js).

Vérifier la console pour les logs de Socket.io (console.log("📨 Nouveau mail reçu:", mail)).

Technologies utilisées

React Native / Expo

Node.js

Express

Socket.io

n8n