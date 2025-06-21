require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


const users = {
  1: { id: 1, username: 'alice', points: 200, badges: ['Saver', 'Goal Crusher'] },
  2: { id: 2, username: 'bob', points: 120, badges: ['First Budget'] },
};

app.get('/', (req, res) => {
  res.json({ message: 'LevelUp Budget API is running!' });
});

app.get('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.get('/leaderboard', (req, res) => {
  const leaderboard = Object.values(users).sort((a, b) => b.points - a.points);
  res.json(leaderboard);
});

app.post('/budget', (req, res) => {
  console.log('Received budget entry:', req.body);
  res.json({ status: 'success', data: req.body });
});

app.get('/suggestions/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'User not found' });

  const suggestion = {
    user_id: user.id,
    suggestion: 'Cancel your unused music subscription to save $12/month.',
  };
  res.json(suggestion);
});

app.listen(PORT, () => {
  console.log(`LevelUp Budget backend is running on http://localhost:${PORT}`);
});

