const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Stockage temporaire
const mails = [];

// Route GET pour récupérer les mails existants
app.get('/mails', (req, res) => res.json(mails));

// Route POST depuis n8n
app.post('/mails', (req, res) => {
  const mail = req.body;
  mails.push(mail);
  io.emit('new-mail', mail); // <- envoie en temps réel aux clients connectés
  res.json({ status: 'ok', received: mail });
});

server.listen(3000, () => console.log('Server running on port 3000'));
