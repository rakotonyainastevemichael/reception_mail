const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connexion à Supabase
const SUPABASE_URL = 'https://ubkzspjdkjdlvuomlduz.supabase.co'; // <-- ton URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3pzcGpka2pkbHZ1b21sZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDEzMjgsImV4cCI6MjA3ODA3NzMyOH0.WijUvQtOwM3i9U7niKrUqQipK4jPBpgpLLWVAOZzg4M'; // <-- clé anonyme
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔥 Serveur HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ✅ Récupérer les mails de la DB
app.get('/mails', async (req, res) => {
  const { data, error } = await supabase
    .from('mails')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// ✅ Ajouter un mail depuis n8n
app.post('/mails', async (req, res) => {
  const mail = req.body;
  const { data, error } = await supabase
    .from('mails')
    .insert([mail])
    .select();

  if (error) return res.status(400).json({ error });
  io.emit('new-mail', data[0]);
  res.json({ status: 'ok', received: data[0] });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Serveur en ligne sur le port ${PORT}`));
