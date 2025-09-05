const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000; // Render default is 10000

app.use(cors());
app.use(express.json());

const SAVE_DIR = path.join(__dirname, 'saves');
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR);

function getUserFile(user) {
  const safeUser = user.replace(/[^a-zA-Z0-9_-]/g, '');
  return path.join(SAVE_DIR, `${safeUser}.json`);
}

// Save endpoint
app.post('/api/game/save', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).send('Missing user');
  fs.writeFile(getUserFile(user), JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).send('Save failed');
    res.send('OK');
  });
});

// Load endpoint
app.get('/api/game/load', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).send('Missing user');
  const file = getUserFile(user);
  if (!fs.existsSync(file)) return res.json(null);
  fs.readFile(file, (err, data) => {
    if (err) return res.status(500).send('Read failed');
    res.type('json').send(data);
  });
});

app.get('/', (req, res) => res.send('Game Save API is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));