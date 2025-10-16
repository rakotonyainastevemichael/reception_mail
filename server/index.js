// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Stockage temporaire des mails
let mails = [];

// Endpoint pour récupérer les mails
app.get('/mails', (req, res) => {
  res.json(mails);
});

// Endpoint pour ajouter un mail (webhook n8n)
app.post('/mails', (req, res) => {
  const mail = req.body;
  if (mail.from && mail.subject && mail.body && mail.date) {
    mails.unshift(mail);
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'error', message: 'Format invalide' });
  }
});

// Écoute sur toutes les interfaces réseau
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://192.168.2.121:3000');
});
