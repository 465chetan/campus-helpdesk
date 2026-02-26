const express = require('express');
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { search } = req.query;
    let q = `SELECT u.id, u.name, u.email, u.role, u.department_id, u.created_at, d.department_name 
             FROM users u LEFT JOIN departments d ON u.department_id = d.id`;
    let params = [];
    if (search) {
      q += ' WHERE u.name LIKE ? OR u.email LIKE ?';
      const s = `%${search}%`;
      params.push(s, s);
    }
    q += ' ORDER BY u.created_at DESC';
    const [rows] = await db.query(q, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role, department_id } = req.body;
    await db.query(
      'UPDATE users SET role=?, department_id=? WHERE id=?',
      [role, department_id || null, req.params.id]
    );
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/analytics/complaints', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [byCategory] = await db.query('SELECT category, COUNT(*) as count FROM complaints GROUP BY category');
    const [byStatus] = await db.query('SELECT status, COUNT(*) as count FROM complaints GROUP BY status');
    const [byDept] = await db.query(`
      SELECT d.department_name, COUNT(c.id) as total, 
        SUM(CASE WHEN c.status='resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN c.status='pending' THEN 1 ELSE 0 END) as pending
      FROM departments d LEFT JOIN complaints c ON d.id = c.department_id GROUP BY d.id
    `);
    const [daily] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM complaints 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
      GROUP BY DATE(created_at) ORDER BY date
    `);
    res.json({ byCategory, byStatus, byDept, daily });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;