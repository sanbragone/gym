const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('gym.db');

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    day TEXT,
    name TEXT,
    series INTEGER,
    reps INTEGER,
    weight REAL
  )`);
});

app.get('/api/exercises', (req, res) => {
  const { user, day } = req.query;
  db.all('SELECT * FROM exercises WHERE user = ? AND day = ?', [user, day], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/exercises', (req, res) => {
  const { user, day, name, series, reps, weight } = req.body;
  db.run(
    'INSERT INTO exercises (user, day, name, series, reps, weight) VALUES (?, ?, ?, ?, ?, ?)',
    [user, day, name, series, reps, weight],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/exercises/:id', (req, res) => {
  const { name, series, reps, weight } = req.body;
  db.run(
    'UPDATE exercises SET name = ?, series = ?, reps = ?, weight = ? WHERE id = ?',
    [name, series, reps, weight, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.delete('/api/exercises/:id', (req, res) => {
  db.run('DELETE FROM exercises WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
