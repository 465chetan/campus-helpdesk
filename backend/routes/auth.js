const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();
require('dotenv').config();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', uid, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    // Check email already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: 'Email already registered' });

    // Check UID already exists
    if (uid) {
      const [existingUid] = await db.query(
        'SELECT id FROM users WHERE uid = ?', [uid]
      );
      if (existingUid.length > 0)
        return res.status(400).json({ message: 'UID already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, role, uid, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hash, role, uid || null, phone || null]
    );
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query(
      `SELECT u.*, d.department_name FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id 
       WHERE u.email = ?`,
      [email]
    );
    if (!rows.length)
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user.id, email: user.email,
        role: user.role, department_id: user.department_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        uid: user.uid,
        phone: user.phone,
        department_id: user.department_id,
        department_name: user.department_name
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const jwt2 = require('jsonwebtoken');
    const decoded = jwt2.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.uid, u.phone, 
       u.department_id, u.created_at, d.department_name 
       FROM users u LEFT JOIN departments d ON u.department_id = d.id 
       WHERE u.id = ?`,
      [decoded.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const jwt2 = require('jsonwebtoken');
    const decoded = jwt2.verify(token, process.env.JWT_SECRET);
    const { name, phone } = req.body;
    await db.query(
      'UPDATE users SET name=?, phone=? WHERE id=?',
      [name, phone || null, decoded.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;