const express = require('express');
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, 
        COUNT(c.id) as total_complaints,
        SUM(CASE WHEN c.status='pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN c.status='resolved' THEN 1 ELSE 0 END) as resolved
      FROM departments d 
      LEFT JOIN complaints c ON d.id = c.department_id
      GROUP BY d.id ORDER BY d.department_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { department_name, category_key, description, email, head_name } = req.body;
    await db.query(
      'INSERT INTO departments (department_name, category_key, description, email, head_name) VALUES (?, ?, ?, ?, ?)',
      [department_name, category_key, description, email, head_name]
    );
    res.status(201).json({ message: 'Department created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { department_name, description, email, head_name, is_active } = req.body;
    await db.query(
      'UPDATE departments SET department_name=?, description=?, email=?, head_name=?, is_active=? WHERE id=?',
      [department_name, description, email, head_name, is_active, req.params.id]
    );
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;