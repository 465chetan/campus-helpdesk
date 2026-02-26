const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendComplaintCreatedEmail = async ({ to, userName, ticketId, subject, category, priority, department }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a2942;padding:20px;text-align:center;">
        <h2 style="color:#ff6b35;margin:0;">MRU Campus Helpdesk</h2>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;">
        <h3>Complaint Registered ✅</h3>
        <p>Dear <strong>${userName}</strong>,</p>
        <p>Your complaint has been registered and routed to <strong>${department}</strong> department.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;width:40%;">Ticket ID</td><td style="padding:8px;">${ticketId}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">Subject</td><td style="padding:8px;">${subject}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">Category</td><td style="padding:8px;">${category}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">Priority</td><td style="padding:8px;">${priority}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">Status</td><td style="padding:8px;color:#f59e0b;">Pending</td></tr>
        </table>
        <p>You will receive updates as your complaint progresses.</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `[${ticketId}] Complaint Registered - ${subject}`,
    html
  });
};

const sendStatusUpdateEmail = async ({ to, userName, ticketId, subject, status, remarks }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a2942;padding:20px;text-align:center;">
        <h2 style="color:#ff6b35;margin:0;">MRU Campus Helpdesk</h2>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;">
        <h3>Complaint Status Updated 🔔</h3>
        <p>Dear <strong>${userName}</strong>,</p>
        <p>Your complaint <strong>${ticketId}</strong> status has been updated to: <strong>${status.replace('_', ' ').toUpperCase()}</strong></p>
        ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `[${ticketId}] Status Updated - ${status.replace('_', ' ')}`,
    html
  });
};

const sendDeptNotificationEmail = async ({ to, ticketId, subject, category, priority, userName, description }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a2942;padding:20px;text-align:center;">
        <h2 style="color:#ff6b35;margin:0;">New Complaint Assigned</h2>
      </div>
      <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;">
        <h3>Action Required!</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;width:40%;">Ticket ID</td><td style="padding:8px;">${ticketId}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">User</td><td style="padding:8px;">${userName}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">Subject</td><td style="padding:8px;">${subject}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">Priority</td><td style="padding:8px;">${priority}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold;">Description</td><td style="padding:8px;">${description}</td></tr>
        </table>
        <p>Please login to the portal to take action.</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `[ACTION REQUIRED] New Complaint: ${ticketId}`,
    html
  });
};

module.exports = {
  sendComplaintCreatedEmail,
  sendStatusUpdateEmail,
  sendDeptNotificationEmail
};