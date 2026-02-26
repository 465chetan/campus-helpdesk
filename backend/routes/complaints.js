const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { sendComplaintCreatedEmail, sendStatusUpdateEmail, sendDeptNotificationEmail } = require('../utils/email');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const generateTicketId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `MRU-${rand}`;
};

const CATEGORY_MAP = {
  library: 'library',
  transport: 'transport',
  hostel: 'hostel',
  auditorium: 'auditorium',
  canteen: 'canteen',
  it_support: 'it_support',
  examination: 'examination',
  maintenance: 'maintenance',
  others: 'others',
};

// Create complaint
router.post('/', authenticate, upload.single('attachment'), async (req, res) => {
  try {
    const { category, subject, description, location, block, room_no, priority = 'medium' } = req.body;
    const ticketId = generateTicketId();
    const attachmentPath = req.file ? req.file.filename : null;

    const catKey = CATEGORY_MAP[category] || 'others';
    const [depts] = await db.query('SELECT id, email FROM departments WHERE category_key = ?', [catKey]);
    const deptId = depts.length ? depts[0].id : null;
    const deptEmail = depts.length ? depts[0].email : null;

    await db.query(
      'INSERT INTO complaints (ticket_id, user_id, department_id, category, subject, description, location, block, room_no, priority, attachment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ticketId, req.user.id, deptId, category, subject, description, location || null, block || null, room_no || null, priority, attachmentPath]
    );

    const [users] = await db.query('SELECT name, email FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    const [deptRows] = await db.query('SELECT department_name FROM departments WHERE id = ?', [deptId]);
    const deptName = deptRows.length ? deptRows[0].department_name : 'Management';

    try {
      await sendComplaintCreatedEmail({ to: user.email, userName: user.name, ticketId, subject, category, priority, department: deptName });
      if (deptEmail) await sendDeptNotificationEmail({ to: deptEmail, ticketId, subject, category, priority, userName: user.name, description });
      await sendDeptNotificationEmail({ to: process.env.ADMIN_EMAIL, ticketId, subject, category, priority, userName: user.name, description });
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    res.status(201).json({ message: 'Complaint submitted', ticketId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get complaints
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, category, department_id, search } = req.query;
    let base = `SELECT c.*, u.name as user_name, u.email as user_email, d.department_name 
      FROM complaints c 
      JOIN users u ON c.user_id = u.id 
      LEFT JOIN departments d ON c.department_id = d.id WHERE 1=1`;
    let params = [];

    if (req.user.role === 'student' || req.user.role === 'faculty') {
      base += ' AND c.user_id = ?'; params.push(req.user.id);
    } else if (req.user.role === 'staff') {
      base += ' AND c.department_id = ?'; params.push(req.user.department_id);
    }
    if (status) { base += ' AND c.status = ?'; params.push(status); }
    if (category) { base += ' AND c.category = ?'; params.push(category); }
    if (department_id) { base += ' AND c.department_id = ?'; params.push(department_id); }
    if (search) {
      base += ' AND (c.ticket_id LIKE ? OR c.subject LIKE ? OR u.name LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    base += ' ORDER BY c.created_at DESC';
    const [rows] = await db.query(base, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single complaint
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    let where = '';
    let params = [];
    if (req.user.role === 'student' || req.user.role === 'faculty') {
      where = 'WHERE user_id = ?'; params.push(req.user.id);
    } else if (req.user.role === 'staff') {
      where = 'WHERE department_id = ?'; params.push(req.user.department_id);
    }
    const [total] = await db.query(`SELECT COUNT(*) as count FROM complaints ${where}`, params);
    const [pending] = await db.query(`SELECT COUNT(*) as count FROM complaints ${where ? where + ' AND' : 'WHERE'} status = 'pending'`, [...params]);
    const [inProgress] = await db.query(`SELECT COUNT(*) as count FROM complaints ${where ? where + ' AND' : 'WHERE'} status = 'in_progress'`, [...params]);
    const [resolved] = await db.query(`SELECT COUNT(*) as count FROM complaints ${where ? where + ' AND' : 'WHERE'} status = 'resolved'`, [...params]);
    const [assigned] = await db.query(`SELECT COUNT(*) as count FROM complaints ${where ? where + ' AND' : 'WHERE'} status = 'assigned'`, [...params]);

    res.json({
      total: total[0].count,
      pending: pending[0].count,
      in_progress: inProgress[0].count,
      resolved: resolved[0].count,
      assigned: assigned[0].count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.name as user_name, u.email as user_email, d.department_name 
       FROM complaints c JOIN users u ON c.user_id = u.id 
       LEFT JOIN departments d ON c.department_id = d.id WHERE c.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Not found' });

    const [updates] = await db.query(
      `SELECT cu.*, u.name as updater_name FROM complaint_updates cu 
       JOIN users u ON cu.updated_by = u.id WHERE cu.complaint_id = ? ORDER BY cu.created_at ASC`,
      [req.params.id]
    );
    res.json({ ...rows[0], updates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update complaint
router.put('/:id', authenticate, authorize('admin', 'staff'), upload.single('attachment'), async (req, res) => {
  try {
    const { status, message, priority, department_id } = req.body;
    const attachmentPath = req.file ? req.file.filename : null;

    const [comp] = await db.query(
      'SELECT c.*, u.name, u.email FROM complaints c JOIN users u ON c.user_id = u.id WHERE c.id = ?',
      [req.params.id]
    );
    if (!comp.length) return res.status(404).json({ message: 'Not found' });

    let updateFields = [];
    let updateVals = [];
    if (status) { updateFields.push('status = ?'); updateVals.push(status); }
    if (priority) { updateFields.push('priority = ?'); updateVals.push(priority); }
    if (department_id) { updateFields.push('department_id = ?'); updateVals.push(department_id); }

    if (updateFields.length) {
      await db.query(`UPDATE complaints SET ${updateFields.join(', ')} WHERE id = ?`, [...updateVals, req.params.id]);
    }

    await db.query(
      'INSERT INTO complaint_updates (complaint_id, updated_by, message, status, attachment) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.user.id, message || null, status || null, attachmentPath]
    );

    try {
      await sendStatusUpdateEmail({
        to: comp[0].email,
        userName: comp[0].name,
        ticketId: comp[0].ticket_id,
        subject: comp[0].subject,
        status: status || comp[0].status,
        remarks: message
      });
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;