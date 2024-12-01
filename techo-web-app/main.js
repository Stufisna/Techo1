const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const db = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '2324',
  database: 'user',
});

db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Database connection error:', err));

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Signup Endpoint
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (result.rows.length > 0) {
      res.json({ success: false, message: 'User already exists' });
    } else {
      db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error saving user' });
        res.json({ success: true, message: 'Sign-up successful' });
      });
    }
  });
});

// Start Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
