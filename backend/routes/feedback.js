const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Submit feedback
router.post('/', authenticate, async (req, res) => {
  try {
    const { complaint_id, rating, comment } = req.body;

    if (!complaint_id || !rating)
      return res.status(400).json({ message: 'Complaint and rating required' });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    // Check complaint exists and is resolved
    const [complaints] = await db.query(
      'SELECT * FROM complaints WHERE id = ? AND user_id = ?',
      [complaint_id, req.user.id]
    );

    if (!complaints.length)
      return res.status(404).json({ message: 'Complaint not found' });

    if (complaints[0].status !== 'resolved')
      return res.status(400).json({ message: 'Can only give feedback for resolved complaints' });

    // Check feedback already given
    const [existing] = await db.query(
      'SELECT id FROM feedback WHERE complaint_id = ?',
      [complaint_id]
    );

    if (existing.length)
      return res.status(400).json({ message: 'Feedback already submitted' });

    await db.query(
      'INSERT INTO feedback (complaint_id, user_id, department_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [complaint_id, req.user.id, complaints[0].department_id, rating, comment || null]
    );

    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get feedback for a complaint
router.get('/complaint/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT f.*, u.name as user_name 
       FROM feedback f 
       JOIN users u ON f.user_id = u.id 
       WHERE f.complaint_id = ?`,
      [req.params.id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all feedback for admin
router.get('/department/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT f.*, u.name as user_name, c.subject, c.ticket_id
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       JOIN complaints c ON f.complaint_id = c.id
       WHERE f.department_id = ?
       ORDER BY f.created_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all feedback - admin
router.get('/all', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT f.*, u.name as user_name, 
       c.subject, c.ticket_id,
       d.department_name
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       JOIN complaints c ON f.complaint_id = c.id
       JOIN departments d ON f.department_id = d.id
       ORDER BY f.created_at DESC`
    );

    // Department ratings summary
    const [deptRatings] = await db.query(
      `SELECT d.department_name, 
       ROUND(AVG(f.rating), 1) as avg_rating,
       COUNT(f.id) as total_feedback
       FROM feedback f
       JOIN departments d ON f.department_id = d.id
       GROUP BY f.department_id
       ORDER BY avg_rating DESC`
    );

    res.json({ feedback: rows, deptRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;